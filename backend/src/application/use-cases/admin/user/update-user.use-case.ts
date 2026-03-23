import type * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';
import type { IPasswordService } from '../../../../domain/interfaces/services/password.service';
import type { IAdminUserProfile } from '../../../../domain/entities/admin/user.entity';

export interface IUpdateUserInput {
  id: string;
  fullName?: string;
  email?: string;
  password?: string;
  status?: string;
}

export class UpdateUserUseCase {
  constructor(
    private readonly userRepo: typeof userRepository,
    private readonly passSvc: IPasswordService,
  ) { }

  async execute(dataUser: IUpdateUserInput): Promise<IAdminUserProfile> {
    const { id, fullName, email, password, status } = dataUser;

    // Find user first
    const existingUser = await this.userRepo.findById(id);
    if (!existingUser) {
      throw new Error('Người dùng không tồn tại!');
    }

    // Check if new email exists (if email is being changed)
    if (email && email !== existingUser.email) {
      const emailExists = await this.userRepo.findByEmail(email);
      if (emailExists) {
        throw new Error('Email này đã tồn tại trong hệ thống!');
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await this.passSvc.hash(password);
      updateData.password = hashedPassword;
    }
    if (status) updateData.status = status;

    const updatedUser = await this.userRepo.updateUser(id, updateData);
    if (!updatedUser) {
      throw new Error('Lỗi cập nhật người dùng!');
    }

    return updatedUser.getProfile();
  }
}
