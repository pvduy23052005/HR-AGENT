import Account from '../../models/accountAdmin.model';
import { AdminEntity } from '../../../../domain/entities/admin/accountAdmin.entity';
import type { IAccountAdminDocument } from '../../models/accountAdmin.model';

const mapToEntity = (doc: (IAccountAdminDocument & { _id: { toString(): string } }) | null): AdminEntity | null => {
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

export const findAccountByEmail = async (email: string): Promise<AdminEntity | null> => {
  const adminDoc = await Account.findOne({ email, deleted: false }).lean();
  return mapToEntity(adminDoc as (IAccountAdminDocument & { _id: { toString(): string } }) | null);
};

export const findAccountByID = async (ID: string): Promise<AdminEntity | null> => {
  const adminDoc = await Account.findOne({ _id: ID, deleted: false }).lean();
  return mapToEntity(adminDoc as (IAccountAdminDocument & { _id: { toString(): string } }) | null);
};
