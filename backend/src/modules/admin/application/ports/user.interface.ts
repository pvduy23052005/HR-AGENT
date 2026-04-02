import { UserEntity } from '../../domain/entities/user.entity';

export interface IReadUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<(UserEntity | null)[]>;
}

export interface IWriteUserRepository {
  create(user: UserEntity): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<UserEntity | null>;
}