import { Request, Response } from 'express';
import * as userUseCase from '../../../../application/use-case/client/user.use-case';
import * as userRepository from '../../../../infrastructure/database/repositories/client/user.repository';
import * as otpRepository from '../../../../infrastructure/database/repositories/client/otp.repository';
import * as emailService from '../../../../infrastructure/external-service/mail.service';
import * as passwordService from '../../../../infrastructure/external-service/password.service';

// [POST] /user/password/forgot
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as { email: string };
    const result = await userUseCase.forgotPassword(userRepository, otpRepository, emailService, email);
    res.status(200).json({ success: true, message: 'Mã OTP đã được gửi đến email của bạn!', email: result.email });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ success: false, message: e.message ?? 'Lỗi gửi mail' });
  }
};

// [POST] /user/password/otp
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body as { email: string; otp: string };
    await userUseCase.verifyOtp(userRepository, otpRepository, email, otp);
    res.status(200).json({ success: true, message: 'Xác thực OTP thành công!' });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ success: false, message: e.message ?? 'Lỗi hệ thống' });
  }
};

// [POST] /user/password/reset
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, confirmPassword } = req.body as {
      email: string;
      password: string;
      confirmPassword: string;
    };
    await userUseCase.resetPassword(userRepository, otpRepository, passwordService, email, password, confirmPassword);
    res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ success: false, message: e.message ?? 'Lỗi đổi mật khẩu' });
  }
};
