import { randomNumber } from '../../../../../shared/utils/randomNumber.util';
import { htmlEmailOtp } from '../../../../../shared/templates/email/otp';
import type { IUserReadRepo } from '../../../application/ports/repositories/user.interface';
import type { IOTPReadRepo, IOTPWriteRepo } from '../../../application/ports/repositories/otp.interface';
import type { IMailService } from '../../../application/ports/services/mail.service';
import { OTPEntity } from '../../../domain/otp/otp.entity';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepo: IUserReadRepo,
    private readonly otpRepo: IOTPReadRepo & IOTPWriteRepo,
    private readonly mailService: IMailService,
  ) { }

  async execute(email: string): Promise<{ email: string }> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new Error('Email không tồn tại trong hệ thống!');

    if (!user.isActive()) {
      throw new Error("Tài khoản của bạn đã bị khóa");
    }

    const recentOtp = await this.otpRepo.findRecentOTP(email);
    if (recentOtp) {
      const secondsPassed = (Date.now() - new Date(recentOtp.getCreatedAt()!).getTime()) / 1000;
      if (secondsPassed < 60) {
        throw new Error(`Vui lòng đợi ${Math.ceil(60 - secondsPassed)} giây trước khi yêu cầu mã mới!`);
      }
    }

    const otpCode = randomNumber(6);
    const otpEntity = OTPEntity.create({ email, otp: otpCode, expiresInMinutes: 5 });
    const savedOtp = await this.otpRepo.create(otpEntity);

    if (!savedOtp) throw new Error('Không thể tạo mã OTP!');

    const subject = 'Mã OTP lấy lại mật khẩu';
    const content = htmlEmailOtp(savedOtp.getOtp());
    await this.mailService.sendEmail(email, subject, content);

    return { email };
  }
}
