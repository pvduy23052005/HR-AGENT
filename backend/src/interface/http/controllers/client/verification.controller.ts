import { Request, Response } from 'express';
import { GetVerificationUseCase } from '../../../../application/use-cases/client/verfication/get-verification.use-case';
import { VerifyCandidateUseCase } from '../../../../application/use-cases/client/verfication/candidate-verify.use-case';

import { VerificationRepository } from '../../../../infrastructure/database/repositories/client/verification.repository';

const verificationRepository = new VerificationRepository();

// [GET] /verification/:candidateID
export const getVerificationDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidateID = req.params.candidateID as string;

    if (!candidateID) {
      res.status(400).json({ success: false, message: 'Thiếu candidateID!' });
      return;
    }

    const getVerificationUseCase = new GetVerificationUseCase(verificationRepository);
    const verification = await getVerificationUseCase.execute(candidateID);

    if (!verification) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy dữ liệu kiểm chứng cho ứng viên này!',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Thành công',
      verification,
    });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({
      success: false,
      message: e.message ?? 'Đã xảy ra lỗi khi lấy thông tin kiểm chứng!',
    });
  }
};

// [POST] /verification/candidate 
export const verifyCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateID, data } = req.body;

    const dataCandidate = data.details.replace(/```json/g, '').replace(/```/g, '').trim();

    const candidateJson = JSON.parse(dataCandidate);

    if (!candidateID) {
      res.status(400).json({ success: false, message: 'Thiếu candidateID!' });
      return;
    }

    if (!data) {
      res.status(400).json({ success: false, message: 'Không có dữ liệu xác minh!' });
      return;
    }

    const candidateVerifyUseCase = new VerifyCandidateUseCase(verificationRepository);

    const result = await candidateVerifyUseCase.execute(candidateID, candidateJson);

    res.status(200).json({ success: true, message: 'Xác minh thành công!', verification: result });
  } catch (error) {
    console.error('Lỗi xác minh ứng viên:', error);
    res.status(400).json({
      success: false,
      message: 'Lỗi phân tích ứng viên',
    });
  }
};
