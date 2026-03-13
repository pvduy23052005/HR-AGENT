"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordUseCase = void 0;
const randomNumber_util_1 = require("../../../../shared/utils/randomNumber.util");
const otp_1 = require("../../../../templates/email/otp");
class ForgotPasswordUseCase {
    userRepo;
    otpRepo;
    mailService;
    constructor(userRepo, otpRepo, mailService) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.mailService = mailService;
    }
    async execute(email) {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user)
            throw new Error('Email không tồn tại trong hệ thống!');
        const recentOtp = await this.otpRepo.findRecentOTP(email);
        if (recentOtp) {
            const secondsPassed = (Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000;
            if (secondsPassed < 60) {
                throw new Error(`Vui lòng đợi ${Math.ceil(60 - secondsPassed)} giây trước khi yêu cầu mã mới!`);
            }
        }
        const otp = (0, randomNumber_util_1.randomNumber)(6);
        const record = await this.otpRepo.createOTP(email, otp);
        const subject = 'Mã OTP lấy lại mật khẩu';
        const content = (0, otp_1.htmlEmailOtp)(record.otp);
        await this.mailService.sendEmail(email, subject, content);
        return { email };
    }
}
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
//# sourceMappingURL=forgot-password.use-case.js.map