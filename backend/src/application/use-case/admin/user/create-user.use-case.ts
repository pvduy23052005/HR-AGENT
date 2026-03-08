import type * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';
import type * as passwordService from '../../../../infrastructure/external-service/password.service';
import type { IAdminUserProfile } from '../../../../domain/entities/admin/user.entity';

export interface ICreateUserInput {
  fullName: string;
  email: string;
  password: string;
}

export const createUser = async (
  userRepo: typeof userRepository,
  passSvc: typeof passwordService,
  dataUser: ICreateUserInput,
): Promise<IAdminUserProfile> => {
  const { fullName, email, password } = dataUser;
  const emailExist = await userRepo.findByEmail(email);
  if (emailExist) throw new Error('Email này đã tồn tại trong hệ thống!');

  const hashedPassword = await passSvc.hash(password);
  const newUser = await userRepo.createUser({ fullName, email, password: hashedPassword, status: 'active' });
  return newUser!.getProfile();
};
