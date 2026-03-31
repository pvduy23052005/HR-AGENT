import type { IUserReadRepo } from '../../../application/ports/repositories/user.interface';
import type { IOTPReadRepo } from '../../../application/ports/repositories/otp.interface';

export class VerifyOtpUseCase {
  constructor(
    private readonly userRepo: IUserReadRepo,
    private readonly otpRepo: IOTPReadRepo,
  ) { }

  async execute(email: string, otp: string): Promise<void> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new Error('Email không tồn tại trong hệ thống!');

    if (!user.isActive()) {
      throw new Error('Tài khoản của bạn đã bị khóa hoặc đã bị xóa!');
    }

    const resultOtp = await this.otpRepo.findByEmailAndOTP(email, otp);
    if (!resultOtp) throw new Error('Mã OTP không chính xác!');

    if (resultOtp.isExpired()) {
      throw new Error('Mã OTP đã hết hạn, vui lòng yêu cầu mã mới!');
    }
  }
}
