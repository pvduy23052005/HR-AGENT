"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassNotOTPUseCase = void 0;
class ResetPassNotOTPUseCase {
    userRepo;
    passwordService;
    constructor(userRepo, passwordService) {
        this.userRepo = userRepo;
        this.passwordService = passwordService;
    }
    async execute(email, password, confirmPasswrod) {
        if (password != confirmPasswrod) {
            throw new Error("Mật khẩu không khớp!");
        }
        const existUser = await this.userRepo.findUserByEmail(email);
        if (!existUser) {
            throw new Error("Email không tồn tại!");
        }
        const passwordedHash = await this.passwordService.hash(password);
        await this.userRepo.updateUserPassword(email, passwordedHash);
    }
}
exports.ResetPassNotOTPUseCase = ResetPassNotOTPUseCase;
//# sourceMappingURL=reset-pass-not-otp.use-case.js.map