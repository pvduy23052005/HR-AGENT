import { UserEntity, IAdminUserProps } from '../../domain/entities/user.entity';

export interface ICreateUserData {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  status?: string;
}

export interface IReadUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<(UserEntity | null)[]>;
}

export interface IWriteUserRepository {
  createUser(data: ICreateUserData): Promise<UserEntity | null>;
  updateStatus(id: string, status: string): Promise<UserEntity | null>;
  updateUser(id: string, data: Partial<IAdminUserProps>): Promise<UserEntity | null>;
}

