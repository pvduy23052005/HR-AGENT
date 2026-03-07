import { RequestHandler } from 'express';

export const forgotPasswordValidate: RequestHandler = (req, res, next) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    res.status(400).json({ success: false, message: 'Vui lòng nhập Email!' });
    return;
  }

  next();
};

export const otpPasswordValidate: RequestHandler = (req, res, next) => {
  const { email, otp } = req.body as { email?: string; otp?: string };

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

export const resetPasswordValidate: RequestHandler = (req, res, next) => {
  const { email, password, confirmPassword } = req.body as { email?: string; password?: string; confirmPassword?: string };

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
