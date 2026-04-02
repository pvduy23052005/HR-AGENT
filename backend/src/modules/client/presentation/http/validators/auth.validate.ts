import { RequestHandler } from 'express';

export const loginValidate: RequestHandler = (req, res, next) => {
  const { email, password } = req.body as { email?: string; password?: string };

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

export const signupValidate: RequestHandler = (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body as { fullName?: string; email?: string; password?: string; confirmPassword?: string };

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
