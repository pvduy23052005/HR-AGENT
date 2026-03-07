import type * as candidateRepository from '../../../infrastructure/database/repositories/client/candidate.repository';
import type * as jobRepository from '../../../infrastructure/database/repositories/client/job.repository';
import type * as uploadService from '../../../infrastructure/external-service/upload.service';
import type * as geminiService from '../../../infrastructure/external-service/gemini.service';
import type { CandidateEntity } from '../../../domain/entities/client/candidate.entity';

export interface IUploadCVResult {
  cvLink: unknown;
  newCandidate: CandidateEntity | null;
  dataCV: Record<string, unknown>;
}

export const uploadCV = async (
  candidateRepo: typeof candidateRepository,
  jobRepo: typeof jobRepository,
  uploadSvc: typeof uploadService,
  geminiSvc: typeof geminiService,
  userID: string,
  jobID: string,
  file: Express.Multer.File,
): Promise<IUploadCVResult> => {
  if (!file) throw new Error('No file uploaded');

  const job = await jobRepo.getJobById(jobID);
  if (!job) throw new Error('Công việc không đúng');

  const fileUrls = await uploadSvc.uploadCloud([file]);
  if (!fileUrls || fileUrls.length === 0) throw new Error('Upload CV thất bại');

  const cvLink = fileUrls[0];

  let dataCV: Record<string, unknown> = {
    jobID,
    addedBy: userID,
    personal: { cvLink },
  };

  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    console.log('Đang ném file cho Gemini làm OCR...');
    const extractedData = await geminiSvc.extractCV(file.buffer, file.mimetype);
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

  const newCandidate = await candidateRepo.createCandidate(dataCV as Parameters<typeof candidateRepo.createCandidate>[0]);

  return { cvLink, newCandidate, dataCV };
};
