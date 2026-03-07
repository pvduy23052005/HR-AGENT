import { Request, Response } from 'express';
import { executeAiAnalyize } from '../../../../application/use-case/client/aiAnalyize.use-case';

export const analyzeCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobID, candidateID } = req.body as { jobID: string; candidateID: string };
    const result = await executeAiAnalyize(candidateID, jobID);
    res.status(200).json({ success: true, aiAnalyize: result.data, message: result.message });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi hệ thống khi phân tích AI.' });
  }
};
