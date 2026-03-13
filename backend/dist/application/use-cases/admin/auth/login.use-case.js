"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
class LoginUseCase {
    authRepo;
    tokService;
    constructor(authRepo, tokService) {
        this.authRepo = authRepo;
        this.tokService = tokService;
    }
    async execute(email, password) {
        const admin = await this.authRepo.findAccountByEmail(email);
        if (!admin)
            throw new Error('Email không tồn tại!');
        if (!admin.isActive())
            throw new Error('Tài khoản Admin đã bị khóa!');
        if (!admin.verifyPassword(password))
            throw new Error('Mật khẩu không chính xác!');
        const payload = {
            userID: admin.getID()
        };
        const token = await this.tokService.generateToken(payload);
        return { token, admin: admin.getProfile() };
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=login.use-case.js.map