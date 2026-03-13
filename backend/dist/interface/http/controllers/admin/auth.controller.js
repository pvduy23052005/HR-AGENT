"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const login_use_case_1 = require("../../../../application/use-cases/admin/auth/login.use-case");
const auth_repository_1 = require("../../../../infrastructure/database/repositories/admin/auth.repository");
const token_service_1 = require("../../../../infrastructure/external-service/token.service");
const authRepository = new auth_repository_1.AuthRepository();
const tokenService = new token_service_1.TokenService();
// [POST] /admin/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginUseCase = new login_use_case_1.LoginUseCase(authRepository, tokenService);
        const { admin, token } = await loginUseCase.execute(email, password);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true, message: 'Đăng nhập Admin thành công!',
            token: token,
            admin: admin
        });
    }
    catch (error) {
        const e = error;
        const statusCode = e.statusCode ?? 500;
        res.status(statusCode).json({ code: statusCode, success: false, message: e.message ?? 'Lỗi hệ thống' });
    }
};
exports.login = login;
// [POST] /admin/auth/logout
const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: 'Đăng xuất thành công!' });
    }
    catch (error) {
        const e = error;
        res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: e.message });
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map