import { Request, Response } from 'express';
import { UploadCVUseCase } from '../../../../application/use-cases/client/upload/upload-cv.use-case';
import { CandidateRepository } from '../../../../infrastructure/database/repositories/client/candidate.repository';
import { JobRepository } from '../../../../infrastructure/database/repositories/client/job.repository';
import { UploadService } from '../../../../infrastructure/external-service/upload.service';
import { GeminiService } from '../../../../infrastructure/external-service/gemini.service';

const candidateRepository = new CandidateRepository();
const jobRepository = new JobRepository();
const uploadService = new UploadService();
const geminiService = new GeminiService();
const uploadCVUseCase = new UploadCVUseCase(candidateRepository, jobRepository, uploadService, geminiService);

export const uploadCV = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;
    const file = req.file as Express.Multer.File;
    const { jobID } = req.body as { jobID: string };

    const { cvLink, newCandidate, dataCV } = await uploadCVUseCase.execute(
      userID,
      jobID,
      file,
    );

    res.status(200).json({ message: 'CV processed successfully', cvLink, newCandidate, dataCV });
  } catch (error: unknown) {
    const e = error as { message?: string };
    const statusCode = e.message?.includes('Vui lòng') ? 400 : 500;
    res.status(statusCode).json({ message: e.message });
  }
};
