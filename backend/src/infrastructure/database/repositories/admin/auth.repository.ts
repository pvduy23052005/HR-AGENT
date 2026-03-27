import Account from '../../models/accountAdmin.model';
import { AdminEntity } from '../../../../domain/entities/admin/accountAdmin.entity';
import { IAccountAdmin } from '../../../../domain/repositories/admin/accountAdmin.interface';

export class AuthRepository implements IAccountAdmin {
  private mapToEntity(doc: any | null): AdminEntity | null {
    if (!doc) return null;
    return new AdminEntity({
      id: doc._id.toString(),
      fullName: doc.fullName,
      email: doc.email,
      password: doc.password,
      role: doc.role_id ?? '',
      status: doc.status,
      deleted: doc.deleted,
    });
  }

  async findAccountByEmail(email: string): Promise<AdminEntity | null> {
    const adminDoc = await Account.findOne({ email, deleted: false }).lean();
    return this.mapToEntity(adminDoc);
  }

  async findAccountByID(id: string): Promise<AdminEntity | null> {
    const adminDoc = await Account.findOne({ _id: id, deleted: false }).lean();
    return this.mapToEntity(adminDoc);
  }
}

