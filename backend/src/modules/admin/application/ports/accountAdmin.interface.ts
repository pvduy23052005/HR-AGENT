import { AdminEntity } from "../../domain/entities/accountAdmin.entity";

export interface IAccountAdmin {
  findAccountByEmail(email: string): Promise<AdminEntity | null>;

  findAccountByID(id: string): Promise<AdminEntity | null>;
}