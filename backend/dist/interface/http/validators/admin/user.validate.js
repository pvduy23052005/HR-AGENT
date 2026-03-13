"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidate = void 0;
const createUserValidate = (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {
        res.status(400).json({ code: 400, message: 'Vui lòng nhập Họ tên!' });
        return;
    }
    if (!email) {
        res.status(400).json({ code: 400, message: 'Vui lòng nhập Email!' });
        return;
    }
    if (!password) {
        res.status(400).json({ code: 400, message: 'Vui lòng nhập Mật khẩu!' });
        return;
    }
    next();
};
exports.createUserValidate = createUserValidate;
//# sourceMappingURL=user.validate.js.map