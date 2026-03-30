import { Request, Response } from 'express';
import { UploadCVUseCase } from '../../../application/use-cases/upload/upload-cv.use-case';
import { CandidateRepository } from '../../../infrastructure/database/repositories/candidate.repository';
import { JobRepository } from '../../../infrastructure/database/repositories/job.repository';
import { UploadService } from '../../../infrastructure/external-service/upload.service';
import { GeminiService } from '../../../infrastructure/external-service/gemini.service';

const candidateRepository = new CandidateRepository();
const jobRepository = new JobRepository();
const uploadService = new UploadService();
const geminiService = new GeminiService();
const uploadCVUseCase = new UploadCVUseCase(candidateRepository, jobRepository, uploadService, geminiService);

export const uploadCV = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const cvFile = files?.cv?.[0];
    const avatarFile = files?.avatar?.[0];
    const { jobID } = req.body as { jobID: string };

    const { cvLink, avatarLink, newCandidate, dataCV } = await uploadCVUseCase.execute(
      userID,
      jobID,
      cvFile,
      avatarFile,
    );

    res.status(200).json({ message: 'CV processed successfully', cvLink, avatarLink, newCandidate, dataCV });
  } catch (error: unknown) {
    const e = error as { message?: string };
    const statusCode = e.message?.includes('Vui lòng') ? 400 : 500;
    res.status(statusCode).json({ message: e.message });
  }
};
