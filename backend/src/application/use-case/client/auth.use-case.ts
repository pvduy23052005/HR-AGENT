import * as authRepository from '../../../infrastructure/database/repositories/client/auth.repository';
import * as passwordService from '../../../infrastructure/external-service/password.service';
import * as tokenService from '../../../infrastructure/external-service/token.service';
import type { IUserProfile } from '../../../domain/entities/client/user.entity';

export interface ILoginResult {
  token: string;
  user: IUserProfile;
}

export const login = async (
  authRepo: typeof authRepository,
  passService: typeof passwordService,
  tokService: typeof tokenService,
  email: string,
  password: string,
): Promise<ILoginResult> => {
  const user = await authRepo.findUserByEmail(email);

  if (!user) throw new Error('Email không tồn tại!');
  if (!user.isActive()) throw new Error('Tài khoản đã bị khóa! Vui lòng liên hệ Admin.');

  const passwordMatch = await user.verifyPassword(password, passService);
  if (!passwordMatch) throw new Error('Mật khẩu không chính xác!');

  const token = tokService.generateToken({ userID: user.id });

  return { token, user: user.getProfile() };
};
