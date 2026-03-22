import { Request, Response } from 'express';

import { LoginUseCase } from '../../../../application/use-cases/admin/auth/login.use-case';
import { LogoutUseCase } from '../../../../application/use-cases/admin/auth/logout.use-case';

import { AuthRepository } from '../../../../infrastructure/database/repositories/admin/auth.repository';

import { TokenService } from '../../../../infrastructure/external-service/token.service';

const authRepository = new AuthRepository();
const tokenService = new TokenService();

// [POST] /admin/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const loginUseCase = new LoginUseCase(authRepository, tokenService);
    const { admin, token } = await loginUseCase.execute(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true, message: 'Đăng nhập Admin thành công!',
      token: token,
      admin: admin
    });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    const statusCode = e.statusCode ?? 500;
    res.status(statusCode).json({ code: statusCode, success: false, message: e.message ?? 'Lỗi hệ thống' });
  }
};

// [POST] /admin/auth/logout
export const logout = (req: Request, res: Response): void => {
  try {
    const userID: string = res.locals.admin.id.toString() || "";

    const logoutUsecase = new LogoutUseCase();
    logoutUsecase.execute(userID);

    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Đăng xuất thành công!' });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: e.message });
  }
};
