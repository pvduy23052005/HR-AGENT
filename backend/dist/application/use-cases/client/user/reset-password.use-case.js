"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUseCase = void 0;
class ResetPasswordUseCase {
    userRepo;
    otpRepo;
    passSvc;
    constructor(userRepo, otpRepo, passSvc) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.passSvc = passSvc;
    }
    async execute(email, password, confirmPassword) {
        if (password !== confirmPassword)
            throw new Error('Mật khẩu xác nhận không khớp!');
        const otpSession = await this.otpRepo.findOTPByEmail(email);
        if (!otpSession)
            throw new Error('Phiên giao dịch đã hết hạn, vui lòng lấy lại mã OTP!');
        const user = await this.userRepo.findUserByEmail(email);
        if (!user)
            throw new Error('Email không tồn tại trong hệ thống!');
        const hashedPassword = await this.passSvc.hash(password);
        await this.userRepo.updateUserPassword(email, hashedPassword);
        await this.otpRepo.deleteOTP(email);
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
//# sourceMappingURL=reset-password.use-case.js.map