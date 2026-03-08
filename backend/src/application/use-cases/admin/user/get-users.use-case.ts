import type * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';
import type { IAdminUserProfile } from '../../../../domain/entities/admin/user.entity';

export class GetUsersUseCase {
  constructor(private readonly userRepo: typeof userRepository) { }

  async execute(): Promise<IAdminUserProfile[]> {
    const users = await this.userRepo.findAll();
    return users.map((user) => user!.getProfile());
  }
}
