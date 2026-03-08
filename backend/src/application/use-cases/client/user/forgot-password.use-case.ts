import { randomNumber } from '../../../../shared/utils/randomNumber.util';
import { htmlEmailOtp } from '../../../../templates/email/otp';
import type { IUserRepository } from '../../../../domain/interfaces/client/user.interface';
import type { IOtpRepository } from '../../../../domain/interfaces/client/otp.interface';
import type { IMailService } from '../../../../domain/interfaces/services/mail.service';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpRepo: IOtpRepository,
    private readonly mailService: IMailService,
  ) { }

  async execute(email: string): Promise<{ email: string }> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new Error('Email không tồn tại trong hệ thống!');

    const recentOtp = await this.otpRepo.findRecentOTP(email);
    if (recentOtp) {
      const secondsPassed = (Date.now() - new Date(recentOtp.createdAt!).getTime()) / 1000;
      if (secondsPassed < 60) {
        throw new Error(`Vui lòng đợi ${Math.ceil(60 - secondsPassed)} giây trước khi yêu cầu mã mới!`);
      }
    }

    const otp = randomNumber(6);
    const record = await this.otpRepo.createOTP(email, otp);

    const subject = 'Mã OTP lấy lại mật khẩu';
    const content = htmlEmailOtp(record!.otp);
    await this.mailService.sendEmail(email, subject, content);

    return { email };
  }
}
