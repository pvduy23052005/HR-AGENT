import type { IUserRepository } from '../../../../domain/interfaces/client/user.interface';
import type { IOtpRepository } from '../../../../domain/interfaces/client/otp.interface';

export class VerifyOtpUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpRepo: IOtpRepository,
  ) { }

  async execute(email: string, otp: string): Promise<void> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new Error('Email không tồn tại trong hệ thống!');

    const resultOtp = await this.otpRepo.findByEmailAndOTP(email, otp);
    if (!resultOtp) throw new Error('OTP không chính xác hoặc đã hết hạn!');
  }
}
