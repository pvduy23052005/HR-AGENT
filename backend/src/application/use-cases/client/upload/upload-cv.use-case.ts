import type { ICandidateWriteRepo, ICandidateData, ICandidateReadRepo } from '../../../../domain/repositories/client/candidate.interface';
import type { IJobReadRepo } from '../../../../domain/repositories/client/job.interface';
import type { IUploadService } from '../../../../domain/repositories/services/upload.service';
import type { IAIService } from '../../../../domain/repositories/services/ai.service';
import type { CandidateEntity } from '../../../../domain/entities/client/candidate';

export interface IUploadCVResult {
  cvLink: unknown;
  avatarLink?: unknown;
  newCandidate: CandidateEntity | null;
  dataCV: ICandidateData;
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
  ): Promise<IUploadCVResult> {
    if (!cvFile) throw new Error('No file uploaded');

    const job = await this.jobRepo.getJobById(jobID);
    if (!job) throw new Error('Công việc không đúng');

    // Upload both files
    const filesToUpload = [cvFile];
    if (avatarFile) {
      filesToUpload.push(avatarFile);
    }

    const fileUrls = await this.uploadSvc.uploadCloud(filesToUpload);
    if (!fileUrls || fileUrls.length === 0) throw new Error('Upload CV thất bại');

    const cvLink = fileUrls[0];
    const avatarLink = avatarFile && fileUrls[1] ? fileUrls[1] : undefined;

    let dataCV: ICandidateData = {
      jobID,
      addedBy: userID,
      personal: { cvLink, ...(avatarLink ? { avatar: avatarLink } : {}) },
    };

    if (cvFile.mimetype === 'application/pdf' || cvFile.mimetype.startsWith('image/')) {
      console.log('Đang ném file cho Gemini làm OCR...');
      const extractedData = await this.geminiSvc.extractCV(cvFile.buffer, cvFile.mimetype);
      if (extractedData) {
        const personal = (extractedData['personal'] as Record<string, unknown>) ?? {};
        dataCV = {
          ...extractedData,
          jobID,
          addedBy: userID,
          personal: { ...personal, cvLink, ...(avatarLink ? { avatar: avatarLink } : {}) },
        };
      }
    }

    const personalData = dataCV.personal as Record<string, any>;
    const email = personalData?.email;

    if (!email) {
      throw new Error('không thể trích xuất được Email từ CV ');
    }

    const isExist = await this.candidateRepo.checkExistsCandidate(email);
    let newCandidate: CandidateEntity | null;

    if (isExist) {
      newCandidate = await this.candidateRepo.updateCandidate(email, dataCV);
    } else {
      newCandidate = await this.candidateRepo.createCandidate(dataCV);
    }

    return { cvLink, avatarLink, newCandidate, dataCV };
  }
}
