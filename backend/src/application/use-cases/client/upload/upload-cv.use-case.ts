import type { ICandidateRepository } from '../../../../domain/interfaces/client/candidate.interface';
import type { IJobRepository } from '../../../../domain/interfaces/client/job.interface';
import type { IUploadService } from '../../../../domain/interfaces/services/upload.service';
import type { IGeminiService } from '../../../../domain/interfaces/services/gemini.service';
import type { ICandidateData } from '../../../../infrastructure/database/repositories/client/candidate.repository';
import type { CandidateEntity } from '../../../../domain/entities/client/candidate.entity';

export interface IUploadCVResult {
  cvLink: unknown;
  newCandidate: CandidateEntity | null;
  dataCV: Record<string, unknown>;
}

export class UploadCVUseCase {
  constructor(
    private readonly candidateRepo: ICandidateRepository,
    private readonly jobRepo: IJobRepository,
    private readonly uploadSvc: IUploadService,
    private readonly geminiSvc: IGeminiService,
  ) { }

  async execute(
    userID: string,
    jobID: string,
    file: Express.Multer.File,
  ): Promise<IUploadCVResult> {
    if (!file) throw new Error('No file uploaded');

    const job = await this.jobRepo.getJobById(jobID);
    if (!job) throw new Error('Công việc không đúng');

    const fileUrls = await this.uploadSvc.uploadCloud([file]);
    if (!fileUrls || fileUrls.length === 0) throw new Error('Upload CV thất bại');

    const cvLink = fileUrls[0];

    let dataCV: Record<string, unknown> = {
      jobID,
      addedBy: userID,
      personal: { cvLink },
    };

    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      console.log('Đang ném file cho Gemini làm OCR...');
      const extractedData = await this.geminiSvc.extractCV(file.buffer, file.mimetype);
      if (extractedData) {
        const personal = (extractedData['personal'] as Record<string, unknown>) ?? {};
        dataCV = {
          ...extractedData,
          jobID,
          addedBy: userID,
          personal: { ...personal, cvLink },
        };
      }
    }

    const newCandidate = await this.candidateRepo.createCandidate(dataCV as ICandidateData);

    return { cvLink, newCandidate, dataCV };
  }
}
