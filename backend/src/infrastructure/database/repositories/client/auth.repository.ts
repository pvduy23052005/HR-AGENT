import User from '../../models/user.model';
import { UserEntity } from '../../../../domain/entities/client/user.entity';
import type { IUserDocument } from '../../models/user.model';

type UserDoc = IUserDocument | (Omit<IUserDocument, keyof Document> & { _id: unknown }) | null;

const mapToEntity = (doc: UserDoc): UserEntity | null => {
  if (!doc) return null;
  const d = doc as IUserDocument & { _id: { toString(): string } };

  return new UserEntity({
    id: d._id.toString(),
    fullName: d.fullName,
    email: d.email,
    password: d.password,
    avatar: d.avatar,
    status: d.status,
    deleted: d.deleted,
    deletedAt: d.deletedAt,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  });
};

export const findUserByEmail = async (email: string): Promise<UserEntity | null> => {
  const user = await User.findOne({ email, deleted: false }).lean();
  return mapToEntity(user as UserDoc);
};
