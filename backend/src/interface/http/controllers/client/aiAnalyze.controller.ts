import { Request, Response } from 'express';
import { AiAnalyzeUseCase } from '../../../../application/use-cases/client/aiAnalyze/executeAiAnalyze.use-case';
import { CandidateRepository } from '../../../../infrastructure/database/repositories/client/candidate.repository';
import { JobRepository } from '../../../../infrastructure/database/repositories/client/job.repository';
import { AiAnalysisRepository } from '../../../../infrastructure/database/repositories/client/aiAnalyze.repository';
import { GeminiService } from '../../../../infrastructure/external-service/gemini.service';

const candidateRepository = new CandidateRepository();
const jobRepository = new JobRepository();
const aiAnalyzeRepository = new AiAnalysisRepository();
const geminiService = new GeminiService();

const executeAiAnalyzeUseCase = new AiAnalyzeUseCase(
  candidateRepository,
  jobRepository,
  aiAnalyzeRepository,
  geminiService,
);

// [POST] ai/ananlyze
export const analyzeCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobID, candidateID } = req.body as { jobID: string; candidateID: string };
    const result = await executeAiAnalyzeUseCase.execute(candidateID, jobID);
    res.status(200).json({ success: true, aiAnalyze: result.data, message: result.message });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi hệ thống khi phân tích AI.' });
  }
};
