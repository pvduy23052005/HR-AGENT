import { Request, Response } from 'express';
import * as authUseCase from '../../../../application/use-case/admin/auth';
import * as tokenService from '../../../../infrastructure/external-service/token.service';
import * as authRepository from '../../../../infrastructure/database/repositories/admin/auth.repository';

// [POST] /admin/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { admin, token } = await authUseCase.login(tokenService, authRepository, email, password);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: 'Đăng nhập Admin thành công!', token, admin });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    const statusCode = e.statusCode ?? 500;
    res.status(statusCode).json({ code: statusCode, success: false, message: e.message ?? 'Lỗi hệ thống' });
  }
};

// [POST] /admin/auth/logout
export const logout = (req: Request, res: Response): void => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Đăng xuất thành công!' });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: e.message });
  }
};
