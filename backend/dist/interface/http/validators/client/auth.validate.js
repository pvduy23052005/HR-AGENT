"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidate = exports.loginValidate = void 0;
const loginValidate = (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        res.status(400).json({ code: 400, message: 'Vui lòng nhập Email!' });
        return;
    }
    if (!password) {
        res.status(400).json({ code: 400, message: 'Vui lòng nhập mật khẩu!' });
        return;
    }
    next();
};
exports.loginValidate = loginValidate;
const signupValidate = (req, res, next) => {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !fullName.trim()) {
        res.status(400).json({ code: 400, message: 'Vui lòng nhập họ tên!' });
        return;
    }
    if (!email) {
        res.status(400).json({ code: 400, message: 'Vui lòng nhập Email!' });
        return;
    }
    if (!password) {
        res.status(400).json({ code: 400, message: 'Vui lòng nhập mật khẩu!' });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({ code: 400, message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
        return;
    }
    if (!confirmPassword) {
        res.status(400).json({ code: 400, message: 'Vui lòng xác nhận mật khẩu!' });
        return;
    }
    next();
};
exports.signupValidate = signupValidate;
//# sourceMappingURL=auth.validate.js.map