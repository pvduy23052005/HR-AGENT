import { UserEntity } from "../../entities/client/user.entity";

export interface IAuth {
  findUserByEmail(email: string): Promise<UserEntity | null>;
}
