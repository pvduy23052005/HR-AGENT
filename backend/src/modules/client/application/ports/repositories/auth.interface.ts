import { UserEntity } from "../../../domain/entities/user/user.entity";

export interface IAuth {
  findUserByEmail(email: string): Promise<UserEntity | null>;
}
