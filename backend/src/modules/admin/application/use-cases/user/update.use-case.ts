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
      const error = new Error('Người dùng không tồn tại!') as Error & { statusCode: number };
      error.statusCode = 404;
      throw error;
    }

    if (data.email && data.email !== user.getEmail()) {
      const emailExist = await this.userRepo.findByEmail(data.email);
      if (emailExist) {
        const error = new Error('Email này đã tồn tại trong hệ thống!') as Error & { statusCode: number };
        error.statusCode = 400;
        throw error;
      }
    }

    // Hash password nếu có thay đổi
    const updateData: Record<string, string> = {};
    if (data.fullName) updateData.fullName = data.fullName;
    if (data.email) updateData.email = data.email;
    if (data.status) updateData.status = data.status;
    if (data.password) updateData.password = await this.passSvc.hash(data.password);

    const updatedUser = await this.userRepo.updateUser(id, updateData);
    return updatedUser!.getProfile();
  }
}
