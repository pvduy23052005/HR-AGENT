import Account from '../../models/accountAdmin.model';
import { AdminEntity } from '../../../../domain/entities/admin/accountAdmin.entity';
import { IAccountAdmin } from '../../../../domain/interfaces/admin/accountAdmin.interface';

const mapToEntity = (doc: any | null): AdminEntity | null => {
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
};

export class AuthRepository implements IAccountAdmin {

  async findAccountByEmail(email: string): Promise<AdminEntity | null> {
    const adminDoc = await Account.findOne({ email, deleted: false }).lean();
    return mapToEntity(adminDoc);
  }

  async findAccountByID(id: string): Promise<AdminEntity | null> {
    const adminDoc = await Account.findOne({ _id: id, deleted: false }).lean();
    return mapToEntity(adminDoc);
  }
}

