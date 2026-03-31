import { Request, Response } from 'express';
import { AnalysisUseCase } from '../../../application/use-cases/analyze/analyze.use-case';
import { CandidateRepository } from '../../../infrastructure/database/repositories/candidate.repository';
import { JobRepository } from '../../../infrastructure/database/repositories/job.repository';
import { AiAnalysisRepository } from '../../../infrastructure/database/repositories/aiAnalyze.repository';
import { GeminiService } from '../../../infrastructure/external-service/gemini.service';

const candidateRepository = new CandidateRepository();
const jobRepository = new JobRepository();
const aiAnalyzeRepository = new AiAnalysisRepository();
const geminiService = new GeminiService();

// [POST] ai/ananlyze
export const analyzeCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobID, candidateID } = req.body as { jobID: string; candidateID: string };

    const analyzeUseCase = new AnalysisUseCase(
      candidateRepository,
      jobRepository,
      aiAnalyzeRepository,
      geminiService,
    );
    const result = await analyzeUseCase.execute(candidateID, jobID);

    res.status(200).json({
      success: true,
      aiAnalyze: result.data,
      message: 'Phân tích AI thành công!'
    });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi hệ thống khi phân tích AI.' });
  }
};
