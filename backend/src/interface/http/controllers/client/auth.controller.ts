import { Request, Response } from 'express';
import * as authUseCase from '../../../../application/use-case/client/auth.use-case';
import * as authRepository from '../../../../infrastructure/database/repositories/client/auth.repository';
import * as passwordService from '../../../../infrastructure/external-service/password.service';
import * as tokenService from '../../../../infrastructure/external-service/token.service';

// [POST] /auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { token, user } = await authUseCase.login(authRepository, passwordService, tokenService, email, password);

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.json({ code: 200, message: 'Đăng nhập thành công!', token, user });
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string };
    const statusCode = e.statusCode ?? 500;
    res.status(statusCode).json({ code: statusCode, message: e.message ?? 'Lỗi hệ thống' });
  }
};
