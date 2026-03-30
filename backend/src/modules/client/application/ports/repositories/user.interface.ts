import type { UserEntity } from '../../../domain/entities/user/user.entity';

export interface IUserReadRepo {
  findUserByEmail(email: string): Promise<UserEntity | null>;

  findUserByID(userID: string): Promise<UserEntity | null>;
}

export interface IUserWriteRepo {
  updateUserPassword(email: string, password: string): Promise<UserEntity | null>;
}
