import type * as tokenService from '../../../infrastructure/external-service/token.service';
import type * as authRepository from '../../../infrastructure/database/repositories/admin/auth.repository';
import type { IAdminProfile } from '../../../domain/entities/admin/accountAdmin.entity';

export interface IAdminLoginResult {
  token: string;
  admin: IAdminProfile;
}

export const login = async (
  tokService: typeof tokenService,
  authRepo: typeof authRepository,
  email: string,
  password: string,
): Promise<IAdminLoginResult> => {
  const admin = await authRepo.findAccountByEmail(email);
  if (!admin) throw new Error('Email không tồn tại!');
  if (!admin.isActive()) throw new Error('Tài khoản Admin đã bị khóa!');
  if (!admin.verifyPassword(password)) throw new Error('Mật khẩu không chính xác!');

  const token = tokService.generateToken({ userID: admin.id ?? '' });
  return { token, admin: admin.getProfile() };
};
