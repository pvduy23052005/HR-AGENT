"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpUseCase = void 0;
class VerifyOtpUseCase {
    userRepo;
    otpRepo;
    constructor(userRepo, otpRepo) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
    }
    async execute(email, otp) {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user)
            throw new Error('Email không tồn tại trong hệ thống!');
        const resultOtp = await this.otpRepo.findByEmailAndOTP(email, otp);
        if (!resultOtp)
            throw new Error('OTP không chính xác hoặc đã hết hạn!');
    }
}
exports.VerifyOtpUseCase = VerifyOtpUseCase;
//# sourceMappingURL=verify-otp.use-case.js.map