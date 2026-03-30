import type { IUserReadRepo, IUserWriteRepo } from '../../../application/ports/repositories/user.interface';
import type { IOTPReadRepo, IOTPWriteRepo } from '../../../application/ports/repositories/otp.interface';
import type { IPasswordService } from '../../../application/ports/services/password.service';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepo: IUserReadRepo & IUserWriteRepo,
    private readonly otpRepo: IOTPReadRepo & IOTPWriteRepo,
    private readonly passSvc: IPasswordService,
  ) { }

  async execute(email: string, password: string, confirmPassword: string): Promise<void> {
    if (password !== confirmPassword) throw new Error('Mật khẩu xác nhận không khớp!');

    const otpSession = await this.otpRepo.findOTPByEmail(email);
    if (!otpSession) throw new Error('Phiên giao dịch đã hết hạn, vui lòng lấy lại mã OTP!');

    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new Error('Email không tồn tại trong hệ thống!');

    const hashedPassword = await this.passSvc.hash(password);
    await this.userRepo.updateUserPassword(email, hashedPassword);
    await this.otpRepo.deleteOTP(email);
  }
}
