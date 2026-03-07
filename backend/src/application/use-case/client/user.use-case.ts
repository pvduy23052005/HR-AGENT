import { randomNumber } from '../../../shared/utils/randomNumber.util';
import { htmlEmailOtp } from '../../../templates/email/otp';
import type * as userRepository from '../../../infrastructure/database/repositories/client/user.repository';
import type * as otpRepository from '../../../infrastructure/database/repositories/client/otp.repository';
import type * as mailService from '../../../infrastructure/external-service/mail.service';
import type * as passwordService from '../../../infrastructure/external-service/password.service';

export const forgotPassword = async (
  userRepo: typeof userRepository,
  otpRepo: typeof otpRepository,
  mailSvc: typeof mailService,
  email: string,
): Promise<{ email: string }> => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error('Email không tồn tại trong hệ thống!');

  const recentOtp = await otpRepo.findRecentOTP(email);
  if (recentOtp) {
    const secondsPassed = (Date.now() - new Date(recentOtp.createdAt!).getTime()) / 1000;
    if (secondsPassed < 60) {
      throw new Error(`Vui lòng đợi ${Math.ceil(60 - secondsPassed)} giây trước khi yêu cầu mã mới!`);
    }
  }

  const otp = randomNumber(6);
  const record = await otpRepo.createOTP(email, otp);

  const subject = 'Mã OTP lấy lại mật khẩu';
  const content = htmlEmailOtp(record!.otp);
  await mailSvc.sendEmail(email, subject, content);

  return { email };
};

export const verifyOtp = async (
  userRepo: typeof userRepository,
  otpRepo: typeof otpRepository,
  email: string,
  otp: string,
): Promise<void> => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error('Email không tồn tại trong hệ thống!');

  const resultOtp = await otpRepo.findByEmailAndOTP(email, otp);
  if (!resultOtp) throw new Error('OTP không chính xác hoặc đã hết hạn!');
};

export const resetPassword = async (
  userRepo: typeof userRepository,
  otpRepo: typeof otpRepository,
  passSvc: typeof passwordService,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<void> => {
  if (password !== confirmPassword) throw new Error('Mật khẩu xác nhận không khớp!');

  const otpSession = await otpRepo.findOTPByEmail(email);
  if (!otpSession) throw new Error('Phiên giao dịch đã hết hạn, vui lòng lấy lại mã OTP!');

  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error('Email không tồn tại trong hệ thống!');

  const hashedPassword = await passSvc.hash(password);
  await userRepo.updateUserPassword(email, hashedPassword);
  await otpRepo.deleteOTP(email);
};
