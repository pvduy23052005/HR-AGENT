import type * as userRepository from '../../../../infrastructure/database/repositories/admin/user.repository';
import type { IPasswordService } from '../../../../domain/interfaces/services/password.service';
import type { IAdminUserProfile } from '../../../../domain/entities/admin/user.entity';

export interface ICreateUserInput {
  fullName: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepo: typeof userRepository,
    private readonly passSvc: IPasswordService,
  ) { }

  async execute(dataUser: ICreateUserInput): Promise<IAdminUserProfile> {
    const { fullName, email, password } = dataUser;
    const emailExist = await this.userRepo.findByEmail(email);
    if (emailExist) throw new Error('Email này đã tồn tại trong hệ thống!');

    const hashedPassword = await this.passSvc.hash(password);
    const newUser = await this.userRepo.createUser({ fullName, email, password: hashedPassword, status: 'active' });
    return newUser!.getProfile();
  }
}
