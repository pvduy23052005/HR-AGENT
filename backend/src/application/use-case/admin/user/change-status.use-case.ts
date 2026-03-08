import type * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';
import type { IAdminUserProfile } from '../../../../domain/entities/admin/user.entity';

export const changeStatus = async (
  userRepo: typeof userRepository,
  id: string,
  status: string,
): Promise<IAdminUserProfile> => {
  const user = await userRepo.findById(id);
  if (!user) throw new Error('Người dùng không tồn tại!');
  const updatedUser = await userRepo.updateStatus(id, status);
  return updatedUser!.getProfile();
};
