import type { UserEntity } from '../../entities/client/user.entity';

export interface IUserRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;

  findUserByID(userID: string): Promise<UserEntity | null>;
  
  updateUserPassword(email: string, password: string): Promise<UserEntity | null>;
}
