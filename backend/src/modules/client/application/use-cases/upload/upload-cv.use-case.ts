import type { ICandidateWriteRepo, ICandidateReadRepo } from '../../../application/ports/repositories/candidate.interface';
import type { IJobReadRepo } from '../../../application/ports/repositories/job.interface';
import type { IUploadService } from '../../../application/ports/services/upload.service';
import type { IAIService } from '../../../application/ports/services/ai.service';
import { CandidateEntity } from '../../../domain/entities/candidate/candidate.entity';
import type { ICandidateDetailProfile, ICandidateProps } from '../../../domain/entities/candidate';

export interface IOutputDTO {
  candidate: ICandidateDetailProfile
}

export class UploadCVUseCase {
  constructor(
    private readonly candidateRepo: ICandidateWriteRepo & ICandidateReadRepo,
    private readonly jobRepo: IJobReadRepo,
    private readonly uploadSvc: IUploadService,
    private readonly geminiSvc: IAIService,
  ) { }

  async execute(
    userID: string,
    jobID: string,
    cvFile: Express.Multer.File,
    avatarFile?: Express.Multer.File,
  ): Promise<IOutputDTO> {
    if (!cvFile) throw new Error('No file uploaded');

    const job = await this.jobRepo.getById(jobID);
    if (!job) throw new Error('Công việc không đúng');

    const filesToUpload = [cvFile];
    if (avatarFile) {
      filesToUpload.push(avatarFile);
    }

    const fileUrls = await this.uploadSvc.uploadCloud(filesToUpload);
    if (!fileUrls || fileUrls.length === 0) throw new Error('Upload CV thất bại');

    const cvLink = fileUrls[0];
    const avatarLink = avatarFile && fileUrls[1] ? fileUrls[1] : undefined;

    let extractedData: any = {};

    if (cvFile.mimetype === 'application/pdf' || cvFile.mimetype.startsWith('image/')) {
      console.log('Đang ném file cho Gemini làm OCR...');
      extractedData = await this.geminiSvc.extractCV(cvFile.buffer, cvFile.mimetype);
    }

    const personalData = extractedData.personal as Record<string, any>;
    const email = personalData?.email;

    if (!email) {
      throw new Error('không thể trích xuất được Email từ CV ');
    }

    let newCandidate: CandidateEntity | null = null;
    let candidate = await this.candidateRepo.findByEmail(email);

    if (candidate) {
      candidate.update(extractedData, cvLink, avatarLink);
      newCandidate = await this.candidateRepo.update(candidate);
    } else {
      const candidateProps: ICandidateProps = {
        ...extractedData,
        addedBy: userID,
        jobID: jobID,
        personal: {
          ...extractedData.personal,
          cvLink: cvLink,
          avatar: avatarLink
        }
      };
      const candidate = CandidateEntity.create(candidateProps);
      newCandidate = await this.candidateRepo.create(candidate);
    }

    if (!newCandidate) throw new Error('Lưu hồ sơ ứng viên thất bại!');

    return {
      candidate: newCandidate.getDetailProfile()
    };
  }
}
