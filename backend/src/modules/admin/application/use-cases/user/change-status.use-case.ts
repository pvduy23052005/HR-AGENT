import { IReadUserRepository, IWriteUserRepository } from '../../ports/user.interface';
import type { IAdminUserProfile } from '../../../domain/entities/user.entity';

export class ChangeStatusUseCase {
  constructor(private readonly userRepo: IReadUserRepository & IWriteUserRepository) { }

  async execute(id: string, status: string): Promise<IAdminUserProfile> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error('Người dùng không tồn tại!');

    user.update({ status });
    const updatedUser = await this.userRepo.update(user);
    return updatedUser!.getProfile();
  }
}
