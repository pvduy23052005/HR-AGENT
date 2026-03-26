import { AdminEntity } from "../../entities/admin/accountAdmin.entity";

export interface IAccountAdmin {
  findAccountByEmail(email: string): Promise<AdminEntity | null>;

  findAccountByID(id: string): Promise<AdminEntity | null>;
}