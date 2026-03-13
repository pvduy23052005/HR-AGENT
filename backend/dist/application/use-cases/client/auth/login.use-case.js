"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
class LoginUseCase {
    authRepo;
    passService;
    tokService;
    constructor(authRepo, passService, tokService) {
        this.authRepo = authRepo;
        this.passService = passService;
        this.tokService = tokService;
    }
    async execute(email, password) {
        const user = await this.authRepo.findUserByEmail(email);
        if (!user)
            throw new Error('Email không tồn tại!');
        if (!user.isActive())
            throw new Error('Tài khoản đã bị khóa! Vui lòng liên hệ Admin.');
        const passwordMatch = await user.verifyPassword(password, this.passService);
        if (!passwordMatch)
            throw new Error('Mật khẩu không chính xác!');
        const payload = {
            userID: user.id ?? '',
        };
        const token = await this.tokService.generateToken(payload);
        return { token, user: user.getProfile() };
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=login.use-case.js.map