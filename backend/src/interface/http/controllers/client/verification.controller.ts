import { Request, Response } from 'express';
import { GetVerificationUseCase } from '../../../../application/use-cases/client/verfication/get-verification.use-case';
import { VerifyCandidateUseCase } from '../../../../application/use-cases/client/verfication/candidate-verify.use-case';

import { VerificationRepository } from '../../../../infrastructure/database/repositories/client/verification.repository';
import { CandidateRepository } from '../../../../infrastructure/database/repositories/client/candidate.repository';
import { CandidateStatus } from '../../../../domain/entities/client/candidate.entity';

const verificationRepository = new VerificationRepository();
const candidateRepository = new CandidateRepository();

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
  } catch (error: any) {
    console.error('Lỗi khi lấy thông tin kiểm chứng:', error);
    const status = error.message === 'Not found!' ? 404 : 400;
    res.status(status).json({
      success: false,
      message: error.message ?? 'Đã xảy ra lỗi khi lấy thông tin kiểm chứng!',
    });
  }
};

// [POST] /verification/candidate 
export const verifyCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateID, data } = req.body;

    console.log(data);

    if (!candidateID) {
      res.status(400).json({ success: false, message: 'Thiếu candidateID!' });
      return;
    }

    if (!data) {
      res.status(400).json({ success: false, message: 'Không có dữ liệu xác minh!' });
      return;
    }

    const candidateVerifyUseCase = new VerifyCandidateUseCase(verificationRepository);

    const result = await candidateVerifyUseCase.execute(candidateID, data);

    res.status(200).json({ success: true, message: 'Xác minh thành công!', verification: result });
  } catch (error) {
    console.error('Lỗi xác minh ứng viên:', error);
    res.status(400).json({
      success: false,
      message: 'Lỗi phân tích ứng viên',
    });
  }
};

// [POST] /verification/confirm
export const confirmVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateID, status } = req.body;

    if (!candidateID) {
      res.status(400).json({ success: false, message: 'Thiếu candidateID!' });
      return;
    }

    if (!status || !['trusted', 'risky'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status không hợp lệ. Chỉ cho phép: trusted hoặc risky' });
      return;
    }

    await verificationRepository.updateVerificationStatus(candidateID, status === 'trusted');

    if (status === 'risky') {
      await candidateRepository.updateStatus(candidateID, { status: CandidateStatus.RISKY });
    } else if (status === 'trusted') {
      await candidateRepository.updateStatus(candidateID, { status: CandidateStatus.VERIFIED });
    }

    res.status(200).json({
      success: true,
      message: status === 'trusted' ? 'Xác nhận uy tín thành công!' : 'Đã gắn cờ rủi ro!',
    });
  } catch (error: any) {
    console.error('Lỗi khi xác nhận verification:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xác nhận verification',
    });
  }
};
