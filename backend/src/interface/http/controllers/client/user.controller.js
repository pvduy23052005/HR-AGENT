import * as userUseCase from "../../../../application/use-case/client/user.use-case.js";

import * as userRepository from "../../../../infrastructure/database/repositories/client/user.repository.js";
import * as otpRepository from "../../../../infrastructure/database/repositories/client/otp.repository.js";
import * as emailService from "../../../../infrastructure/external-service/mail.service.js";

import * as passwordService from "../../../../infrastructure/external-service/password.service.js";

// [POST] /user/password/forgot
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await userUseCase.forgotPassword(
      userRepository,
      otpRepository,
      emailService,
      email,
    );

    res.status(200).json({
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn!",
      email: result.email,
      otp: result.otp,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Lỗi gửi mail",
    });
  }
};

// [POST] /user/password/otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    await userUseCase.verifyOtp(userRepository, otpRepository, email, otp);

    res.status(200).json({
      success: true,
      message: "Xác thực OTP thành công!",
    });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Lỗi hệ thống",
    });
  }
};

// [POST] /user/password/reset
export const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    await userUseCase.resetPassword(
      userRepository,
      otpRepository,
      passwordService,
      email,
      password,
      confirmPassword,
    );

    res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Lỗi đổi mật khẩu",
    });
  }
};
