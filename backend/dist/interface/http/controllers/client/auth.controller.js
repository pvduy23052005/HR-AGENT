"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const login_use_case_1 = require("../../../../application/use-cases/client/auth/login.use-case");
const logut_use_case_1 = require("../../../../application/use-cases/client/auth/logut.use-case");
const auth_repository_1 = require("../../../../infrastructure/database/repositories/client/auth.repository");
const password_service_1 = require("../../../../infrastructure/external-service/password.service");
const token_service_1 = require("../../../../infrastructure/external-service/token.service");
const authRepository = new auth_repository_1.AuthRepository();
const passwordService = new password_service_1.PasswordService();
const tokenService = new token_service_1.TokenService();
const loginUseCase = new login_use_case_1.LoginUseCase(authRepository, passwordService, tokenService);
const logoutUseCase = new logut_use_case_1.LogoutUseCase();
// [POST] /auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginUseCase.execute(email, password);
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        res.json({ success: true, code: 200, message: 'Đăng nhập thành công!', token, user });
    }
    catch (error) {
        const e = error;
        const statusCode = e.statusCode ?? 500;
        res.status(statusCode).json({ success: false, code: statusCode, message: e.message ?? 'Lỗi hệ thống' });
    }
};
exports.login = login;
// [POST] /auth/logout
const logout = async (req, res) => {
    try {
        const userID = res.locals.user.id.toString();
        logoutUseCase.execute(userID);
        res.clearCookie('token');
        res.json({ code: 200, message: 'Đăng xuất thành công!' });
    }
    catch (error) {
        const e = error;
        const statusCode = e.statusCode ?? 500;
        res.status(statusCode).json({ code: statusCode, message: e.message ?? 'Lỗi hệ thống' });
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map