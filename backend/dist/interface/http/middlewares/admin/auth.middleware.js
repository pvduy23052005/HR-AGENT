"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const token_service_1 = require("../../../../infrastructure/external-service/token.service");
const auth_repository_1 = require("../../../../infrastructure/database/repositories/admin/auth.repository");
const authRepository = new auth_repository_1.AuthRepository();
const tokenService = new token_service_1.TokenService();
const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({ success: false, message: 'Vui lòng đăng nhập lại.' });
            return;
        }
        const decoded = await tokenService.verifyToken(token);
        const admin = await authRepository.findAccountByID(decoded.userID);
        if (!admin) {
            res.clearCookie('token');
            res.status(401).json({ success: false, message: 'Tài khoản không hợp lệ hoặc đã bị khóa.' });
            return;
        }
        res.locals.admin = admin;
        next();
    }
    catch (error) {
        console.error(error);
        res.clearCookie('token');
        res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map