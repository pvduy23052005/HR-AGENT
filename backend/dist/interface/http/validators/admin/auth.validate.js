"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidate = void 0;
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
//# sourceMappingURL=auth.validate.js.map