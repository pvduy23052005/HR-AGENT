import User from '../../models/user.model';
import { UserEntity } from '../../../../domain/entities/client/user.entity';
import type { IUserDocument } from '../../models/user.model';

const mapToEntity = (doc: (IUserDocument & { _id: { toString(): string } }) | null): UserEntity | null => {
  if (!doc) return null;
  return new UserEntity({
    id: doc._id.toString(),
    fullName: doc.fullName,
    email: doc.email,
    password: doc.password,
    avatar: doc.avatar,
    status: doc.status,
    deleted: doc.deleted,
    deletedAt: doc.deletedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};

export const findUserByEmail = async (email: string): Promise<UserEntity | null> => {
  const doc = await User.findOne({ email, deleted: false }).lean();
  return mapToEntity(doc as (IUserDocument & { _id: { toString(): string } }) | null);
};

export const findUserByID = async (userID: string): Promise<UserEntity | null> => {
  const doc = await User.findOne({ _id: userID, deleted: false, status: 'active' }).lean();
  return mapToEntity(doc as (IUserDocument & { _id: { toString(): string } }) | null);
};

export const updateUserPassword = async (email: string, password: string): Promise<UserEntity | null> => {
  const updatedDoc = await User.findOneAndUpdate(
    { email },
    { password },
    { new: true },
  ).lean();
  return mapToEntity(updatedDoc as (IUserDocument & { _id: { toString(): string } }) | null);
};
