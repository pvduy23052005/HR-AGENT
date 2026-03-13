"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetNotOTP = exports.resetPassword = exports.verifyOTP = exports.forgotPassword = void 0;
const forgot_password_use_case_1 = require("../../../../application/use-cases/client/user/forgot-password.use-case");
const verify_otp_use_case_1 = require("../../../../application/use-cases/client/user/verify-otp.use-case");
const reset_password_use_case_1 = require("../../../../application/use-cases/client/user/reset-password.use-case");
const reset_pass_not_otp_use_case_1 = require("../../../../application/use-cases/client/user/reset-pass-not-otp.use-case");
const user_repository_1 = require("../../../../infrastructure/database/repositories/client/user.repository");
const otp_repository_1 = require("../../../../infrastructure/database/repositories/client/otp.repository");
const mail_service_1 = require("../../../../infrastructure/external-service/mail.service");
const password_service_1 = require("../../../../infrastructure/external-service/password.service");
const userRepository = new user_repository_1.UserRepository();
const otpRepository = new otp_repository_1.OtpRepository();
const emailService = new mail_service_1.MailService();
const passwordService = new password_service_1.PasswordService();
const forgotPasswordUseCase = new forgot_password_use_case_1.ForgotPasswordUseCase(userRepository, otpRepository, emailService);
const verifyOtpUseCase = new verify_otp_use_case_1.VerifyOtpUseCase(userRepository, otpRepository);
const resetPasswordUseCase = new reset_password_use_case_1.ResetPasswordUseCase(userRepository, otpRepository, passwordService);
const ressetPassNotOTPUseCase = new reset_pass_not_otp_use_case_1.ResetPassNotOTPUseCase(userRepository, passwordService);
// [POST] /user/password/forgot
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await forgotPasswordUseCase.execute(email);
        res.status(200).json({ success: true, message: 'Mã OTP đã được gửi đến email của bạn!', email: result.email });
    }
    catch (error) {
        const e = error;
        res.status(e.statusCode ?? 500).json({ success: false, message: e.message ?? 'Lỗi gửi mail' });
    }
};
exports.forgotPassword = forgotPassword;
// [POST] /user/password/otp
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        await verifyOtpUseCase.execute(email, otp);
        res.status(200).json({ success: true, message: 'Xác thực OTP thành công!' });
    }
    catch (error) {
        const e = error;
        res.status(e.statusCode ?? 500).json({ success: false, message: e.message ?? 'Lỗi hệ thống' });
    }
};
exports.verifyOTP = verifyOTP;
// [POST] /user/password/reset
const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        await resetPasswordUseCase.execute(email, password, confirmPassword);
        res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' });
    }
    catch (error) {
        const e = error;
        res.status(e.statusCode ?? 500).json({ success: false, message: e.message ?? 'Lỗi đổi mật khẩu' });
    }
};
exports.resetPassword = resetPassword;
// [post] /user/password/reset-not-otp
const resetNotOTP = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        await ressetPassNotOTPUseCase.execute(email, password, confirmPassword);
        res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Lỗi đổi mật khẩu'
        });
    }
};
exports.resetNotOTP = resetNotOTP;
//# sourceMappingURL=user.controller.js.map