import { Request, Response } from 'express';
import { GetVerificationUseCase } from '../../../../application/use-cases/client/verfication/get-verification.use-case';
import { VerifyCandidateUseCase } from '../../../../application/use-cases/client/verfication/candidate-verify.use-case';

import { VerificationRepository } from '../../../../infrastructure/database/repositories/client/verification.repository';
import { CandidateRepository } from '../../../../infrastructure/database/repositories/client/candidate.repository';
import { CandidateStatus, VerificationStatus } from '../../../../domain/entities/client/candidate';

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

    if (!status || !['verified', 'risky'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status không hợp lệ. Chỉ cho phép: verified hoặc risky' });
      return;
    }

    await verificationRepository.updateVerificationStatus(candidateID, status === 'verified');

    // Get current candidate status to handle transitions properly
    const candidate = await candidateRepository.getCandidateById(candidateID);
    if (!candidate) {
      res.status(404).json({ success: false, message: 'Ứng viên không tìm thấy' });
      return;
    }

    // Update candidate's verificationStatus AND recruitment status based on current status
    if (status === 'risky') {
      // Nếu rủi ro → Reset lại APPLIED for re-evaluation
      await candidateRepository.updateStatus(candidateID, { 
        verificationStatus: VerificationStatus.RISKY,
        status: CandidateStatus.APPLIED
      });
      res.status(200).json({
        success: true,
        message: 'Đánh dấu rủi ro. Reset lại Ứng tuyển.',
      });
    } else if (status === 'verified') {
      // Nếu verified → Auto advance to OFFER
      await candidateRepository.updateStatus(candidateID, { 
        verificationStatus: VerificationStatus.VERIFIED,
        status: CandidateStatus.OFFER
      });
      res.status(200).json({
        success: true,
        message: 'Kiểm chứng thành công! Chuyển sang Đề nghị.',
      });
    }
  } catch (error: any) {
    console.error('Lỗi khi xác nhận verification:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xác nhận verification',
    });
  }
};
