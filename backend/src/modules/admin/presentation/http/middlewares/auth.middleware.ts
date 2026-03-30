import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../../../client/infrastructure/external-service/token.service';

import { AuthRepository } from '../../../infrastructure/repositories/auth.repository';

const authRepository = new AuthRepository();
const tokenService = new TokenService();

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

    const decoded = await tokenService.verifyToken(token);
    const admin = await authRepository.findAccountByID(decoded.userID);

    if (!admin) {
      res.clearCookie('token');
      res.status(401).json({ success: false, message: 'Tài khoản không hợp lệ hoặc đã bị khóa.' });
      return;
    }

    res.locals.admin = admin;
    next();
  } catch (error) {
    console.error(error);
    res.clearCookie('token');
    res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.' });
  }
};
