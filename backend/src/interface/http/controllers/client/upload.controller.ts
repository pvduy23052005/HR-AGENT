import { Request, Response } from 'express';
import * as uploadUseCase from '../../../../application/use-case/client/upload.use-case';
import * as candidateRepository from '../../../../infrastructure/database/repositories/client/candidate.repository';
import * as jobRepository from '../../../../infrastructure/database/repositories/client/job.repository';
import * as uploadService from '../../../../infrastructure/external-service/upload.service';
import * as geminiService from '../../../../infrastructure/external-service/gemini.service';

export const uploadCV = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = res.locals.user.id;
    const file = req.file as Express.Multer.File;
    const { jobID } = req.body as { jobID: string };

    const { cvLink, newCandidate, dataCV } = await uploadUseCase.uploadCV(
      candidateRepository,
      jobRepository,
      uploadService,
      geminiService,
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
