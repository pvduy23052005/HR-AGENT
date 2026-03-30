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

    const resultOtp = await this.otpRepo.findByEmailAndOTP(email, otp);
    if (!resultOtp) throw new Error('OTP không chính xác hoặc đã hết hạn!');
  }
}
