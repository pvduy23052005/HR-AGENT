// Validate forgot password input
export const forgotPasswordValidate = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập Email!",
    });
  }

  next();
};

// Validate OTP input
export const otpPasswordValidate = (req, res, next) => {
  const { email, otp } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập Email!",
    });
  }

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập mã OTP!",
    });
  }

  next();
};

// Validate reset password input
export const resetPasswordValidate = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập Email!",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập mật khẩu mới!",
    });
  }

  if (!confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập xác nhận mật khẩu!",
    });
  }

  next();
};
