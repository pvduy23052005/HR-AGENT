import { IReadUserRepository } from '../../ports/user.interface';
import type { IAdminUserProfile } from '../../../domain/entities/user.entity';

export class GetUsersUseCase {
  constructor(private readonly userRepo: IReadUserRepository) { }

  async execute(): Promise<IAdminUserProfile[]> {
    const users = await this.userRepo.findAll();
    return users.map((user) => user!.getProfile());
  }
}
