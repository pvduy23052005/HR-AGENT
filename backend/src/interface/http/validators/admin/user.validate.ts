import { RequestHandler, Request, Response, NextFunction } from 'express';

export const createUserValidate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { fullName, email, password } = req.body as { fullName?: string; email?: string; password?: string };

  if (!fullName?.trim()) {
    res.status(400).json({ code: 400, message: 'Vui lòng nhập Họ tên!' });
    return;
  }

  if (fullName.trim().length > 20) {
    res.status(400).json({ code: 400, message: 'Họ tên không được vượt quá 20 ký tự!' });
    return;
  }

  if (!email?.trim()) {
    res.status(400).json({ code: 400, message: 'Vui lòng nhập Email!' });
    return;
  }

  if (email.trim().length > 30) {
    res.status(400).json({ code: 400, message: 'Email không được vượt quá 30 ký tự!' });
    return;
  }

  const gmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  if (!gmailRegex.test(email.trim())) {
    res.status(400).json({ code: 400, message: 'Email không hợp lệ! Vui lòng sử dụng địa chỉ @gmail.com.' });
    return;
  }

  if (!password) {
    res.status(400).json({ code: 400, message: 'Vui lòng nhập Mật khẩu!' });
    return;
  }

  next();
};