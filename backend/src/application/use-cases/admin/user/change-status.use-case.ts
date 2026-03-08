import type * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';
import type { IAdminUserProfile } from '../../../../domain/entities/admin/user.entity';

export class ChangeStatusUseCase {
  constructor(private readonly userRepo: typeof userRepository) { }

  async execute(id: string, status: string): Promise<IAdminUserProfile> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error('Người dùng không tồn tại!');
    const updatedUser = await this.userRepo.updateStatus(id, status);
    return updatedUser!.getProfile();
  }
}
