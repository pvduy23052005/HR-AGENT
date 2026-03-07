import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as userRepository from '../../../../infrastructure/database/repositories/client/user.repository';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.token as string | undefined;

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Vui lòng đăng nhập lại.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { userID: string };
    const user = await userRepository.findUserByID(decoded.userID);

    if (!user) {
      res.clearCookie('token');
      res.status(401).json({ success: false, message: 'Tài khoản không hợp lệ hoặc đã bị khóa.' });
      return;
    }

    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.clearCookie('token');
    res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.' });
  }
};
