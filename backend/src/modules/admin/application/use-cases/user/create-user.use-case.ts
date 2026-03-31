import { UserEntity } from '../../../domain/entities/user.entity';
import { IReadUserRepository, IWriteUserRepository } from '../../ports/user.interface';
import type { IPasswordService } from '../../../../client/application/ports/services/password.service';
import type { IAdminUserProfile } from '../../../domain/entities/user.entity';

export interface ICreateUserInput {
  fullName: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepo: IReadUserRepository & IWriteUserRepository,
    private readonly passSvc: IPasswordService,
  ) { }

  async execute(dataUser: ICreateUserInput): Promise<IAdminUserProfile> {
    const { fullName, email, password } = dataUser;
    const emailExist = await this.userRepo.findByEmail(email);
    if (emailExist) throw new Error('Email này đã tồn tại trong hệ thống!');

    const hashedPassword = await this.passSvc.hash(password);
    const userEntity = UserEntity.create({ fullName, email, password: hashedPassword });
    const newUser = await this.userRepo.create(userEntity);
    
    return newUser!.getProfile();
  }
}
