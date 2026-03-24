import { RequestHandler } from 'express';

export const forgotPasswordValidate: RequestHandler = (req, res, next) => {
  const { email } = req.body as { email?: string };

  if (!email?.trim()) {
    res.status(400).json({ success: false, message: 'Vui lòng nhập Email!' });
    return;
  }

  next();
};

export const otpPasswordValidate: RequestHandler = (req, res, next) => {
  const { email, otp } = req.body as { email?: string; otp?: string };

  if (!email?.trim()) {
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

  if (!email?.trim()) {
    res.status(400).json({ success: false, message: 'Vui lòng nhập Email!' });
    return;
  }

  if (!password?.trim()) {
    res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu mới!' });
    return;
  }

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    res.status(400).json({
      success: false,
      message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ số và ký tự đặc biệt!'
    });
    return;
  }

  if (!confirmPassword) {
    res.status(400).json({ success: false, message: 'Vui lòng nhập xác nhận mật khẩu!' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp!' });
    return;
  }

  next();
};
