import { IWriteUserRepository, IReadUserRepository } from '../../ports/user.interface';
import type { IAdminUserProfile } from '../../../domain/entities/user.entity';
import type { IPasswordService } from '../../../../client/application/ports/services/password.service';

export interface IUpdateUserInput {
  fullName?: string;
  email?: string;
  password?: string;
  status?: string;
}

export class UpdateUserUseCase {
  constructor(
    private readonly userRepo: IReadUserRepository & IWriteUserRepository,
    private readonly passSvc: IPasswordService,
  ) { }

  async execute(id: string, data: IUpdateUserInput): Promise<IAdminUserProfile> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('Người dùng không tồn tại!');
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await this.passSvc.hash(data.password);
    }

    user.update(updateData);

    const updatedUser = await this.userRepo.update(user);
    return updatedUser!.getProfile();
  }
}
