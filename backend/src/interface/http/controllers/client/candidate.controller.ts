import { Request, Response } from 'express';
import { GetCandidatesUseCase } from '../../../../application/use-cases/client/candidate/get-candidate.use-case';
import { CandidateRepository } from '../../../../infrastructure/database/repositories/client/candidate.repository';

const candidateRepository = new CandidateRepository();

// [GET] /candidates
export const getCandidates = async (req: Request, res: Response): Promise<void> => {
  try {

    const getCandidatesUseCase = new GetCandidatesUseCase(candidateRepository);
    const candidates = await getCandidatesUseCase.execute();

    if (!candidates || candidates.length === 0) {
      res.status(200).json({ success: true, message: 'Không có ứng viên nào!', candidates: [] });
      return;
    }

    const listSummaryProfile = candidates.map((c) => c.getSummaryProfile());

    res.status(200).json({ success: true, message: 'Thành công', candidates: listSummaryProfile });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi lấy danh sách ứng viên!' });
  }
};