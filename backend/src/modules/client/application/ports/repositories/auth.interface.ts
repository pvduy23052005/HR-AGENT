import { UserEntity } from "../../../domain/user/user.entity";

export interface IAuth {
  findUserByEmail(email: string): Promise<UserEntity | null>;
}
