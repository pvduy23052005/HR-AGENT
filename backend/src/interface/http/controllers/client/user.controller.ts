import { Request, Response } from 'express';
import { ForgotPasswordUseCase } from '../../../../application/use-cases/client/user/forgot-password.use-case';
import { VerifyOtpUseCase } from '../../../../application/use-cases/client/user/verify-otp.use-case';
import { ResetPasswordUseCase } from '../../../../application/use-cases/client/user/reset-password.use-case';
import { UserRepository } from '../../../../infrastructure/database/repositories/client/user.repository';
import { OtpRepository } from '../../../../infrastructure/database/repositories/client/otp.repository';
import { MailService } from '../../../../infrastructure/external-service/mail.service';
import { PasswordService } from '../../../../infrastructure/external-service/password.service';

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();

const emailService = new MailService();
const passwordService = new PasswordService();

const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, otpRepository, emailService);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, otpRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, otpRepository, passwordService);

// [POST] /user/password/forgot
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as { email: string };

    const result = await forgotPasswordUseCase.execute(email);

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

    await verifyOtpUseCase.execute(email, otp);

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

    await resetPasswordUseCase.execute(email, password, confirmPassword);

    res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    res.status(e.statusCode ?? 500).json({ success: false, message: e.message ?? 'Lỗi đổi mật khẩu' });
  }
};
