import type * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';
import type { IAdminUserProfile } from '../../../../domain/entities/admin/user.entity';

export const getUsers = async (
  userRepo: typeof userRepository,
): Promise<IAdminUserProfile[]> => {
  const users = await userRepo.findAll();
  return users.map((user) => user!.getProfile());
};
