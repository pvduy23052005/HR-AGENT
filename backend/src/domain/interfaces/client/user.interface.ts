import type { UserEntity } from '../../entities/client/user';

export interface IUserReadRepo {
  findUserByEmail(email: string): Promise<UserEntity | null>;

  findUserByID(userID: string): Promise<UserEntity | null>;
}

export interface IUserWriteRepo {
  updateUserPassword(email: string, password: string): Promise<UserEntity | null>;
}
