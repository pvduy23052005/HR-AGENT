import { Request, Response } from 'express';
import { LoginUseCase } from '../../../../application/use-cases/client/auth/login.use-case';
import { AuthRepository } from '../../../../infrastructure/database/repositories/client/auth.repository';
import { PasswordService } from '../../../../infrastructure/external-service/password.service';
import { TokenService } from '../../../../infrastructure/external-service/token.service';

const authRepository = new AuthRepository();
const passwordService = new PasswordService();
const tokenService = new TokenService();
const loginUseCase = new LoginUseCase(authRepository, passwordService, tokenService);

// [POST] /auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { token, user } = await loginUseCase.execute(email, password);

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
