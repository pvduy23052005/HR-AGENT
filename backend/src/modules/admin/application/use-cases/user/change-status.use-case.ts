import { IReadUserRepository, IWriteUserRepository } from '../../ports/user.interface';
import type { IAdminUserProfile } from '../../../domain/entities/user.entity';

export class ChangeStatusUseCase {
  constructor(private readonly userRepo: IReadUserRepository & IWriteUserRepository) { }

  async execute(id: string, status: string): Promise<IAdminUserProfile> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error('Người dùng không tồn tại!');
    const updatedUser = await this.userRepo.updateStatus(id, status);
    return updatedUser!.getProfile();
  }
}
