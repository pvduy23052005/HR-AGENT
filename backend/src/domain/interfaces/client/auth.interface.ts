import { UserEntity } from "../../entities/client/user";

export interface IAuth {
  findUserByEmail(email: string): Promise<UserEntity | null>;
}
