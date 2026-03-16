import { Request, Response } from 'express';
import { GetCandidatesUseCase } from '../../../../application/use-cases/client/candidate/get-candidate.use-case';
import { GetCandidateDetailUseCase } from '../../../../application/use-cases/client/candidate/get-candidate-detail.use-case';
import { UpdateStatusUseCase } from '../../../../application/use-cases/client/candidate/update-status.use-case';

import { CandidateRepository } from '../../../../infrastructure/database/repositories/client/candidate.repository';
import { CandidateStatus } from '../../../../domain/entities/client/candidate.entity';

const candidateRepository = new CandidateRepository();

// [GET] /candidates
export const getCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID: string = res.locals.user.id.toString() || "";

    const getCandidatesUseCase = new GetCandidatesUseCase(candidateRepository);
    const candidates = await getCandidatesUseCase.execute(userID);

    if (!candidates || candidates.length === 0) {
      res.status(200).json({ success: true, message: 'Vui lòng thêm ứng viên!', candidates: [] });
      return;
    }

    const listSummaryProfile = candidates.map((c) => c.getSummaryProfile());

    res.status(200).json({ success: true, message: 'Thành công', candidates: listSummaryProfile });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi lấy danh sách ứng viên!' });
  }
};

// [GET] /candidates/:candidateID
export const getCandidateDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidateID = req.params.candidateID as string;

    if (!candidateID) {
      res.status(400).json({ success: false, message: 'Thiếu candidateID!' });
      return;
    }

    const getCandidateDetailUseCase = new GetCandidateDetailUseCase(candidateRepository);
    const candidate = await getCandidateDetailUseCase.execute(candidateID);

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy ứng viên!'
      }
      );
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Thành công',
      candidate: candidate.getDetailProfile()
    });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi lấy thông tin ứng viên!' });
  }
};

// [PATCH] /candidates/change-status/:id
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id.toString() || '';
    const { status } = req.body;

    if (!id) throw new Error('ID ứng viên không hợp lệ.');

    const validStatuses = Object.values(CandidateStatus);
    if (!validStatuses.includes(status as any)) {
      throw new Error(`Trạng thái không hợp lệ. Các trạng thái cho phép: ${validStatuses.join(', ')}`);
    }

    const updateStatusUseCase = new UpdateStatusUseCase(candidateRepository);
    await updateStatusUseCase.execute(id, { status: status as any });

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công.',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái',
    });
  }
};