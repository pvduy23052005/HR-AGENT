import { RequestHandler } from 'express';

export const createUserValidate: RequestHandler = (req, res, next) => {
  const { fullName, email, password } = req.body as { fullName?: string; email?: string; password?: string };

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
