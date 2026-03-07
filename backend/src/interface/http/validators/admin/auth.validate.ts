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
