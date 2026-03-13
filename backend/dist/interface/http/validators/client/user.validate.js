"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidate = exports.otpPasswordValidate = exports.forgotPasswordValidate = void 0;
const forgotPasswordValidate = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập Email!' });
        return;
    }
    next();
};
exports.forgotPasswordValidate = forgotPasswordValidate;
const otpPasswordValidate = (req, res, next) => {
    const { email, otp } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập Email!' });
        return;
    }
    if (!otp) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập mã OTP!' });
        return;
    }
    next();
};
exports.otpPasswordValidate = otpPasswordValidate;
const resetPasswordValidate = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập Email!' });
        return;
    }
    if (!password) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu mới!' });
        return;
    }
    if (!confirmPassword) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập xác nhận mật khẩu!' });
        return;
    }
    next();
};
exports.resetPasswordValidate = resetPasswordValidate;
//# sourceMappingURL=user.validate.js.map