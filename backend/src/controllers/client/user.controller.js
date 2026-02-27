import * as userService from "../../services/client/user.service.js";

// [POST] /user/password/forgot
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await userService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn!",
      email: result.email,
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
export const otpPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;

    await userService.verifyOtp(email, otp);

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

    await userService.resetPassword(email, password, confirmPassword);

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
