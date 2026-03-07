import User from '../../models/user.model';
import { UserEntity } from '../../../../domain/entities/admin/user.entity';
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

export const findByEmail = async (email: string): Promise<UserEntity | null> => {
  const doc = await User.findOne({ email, deleted: false }).lean();
  return mapToEntity(doc as (IUserDocument & { _id: { toString(): string } }) | null);
};

export const findById = async (id: string): Promise<UserEntity | null> => {
  const doc = await User.findOne({ _id: id, deleted: false }).lean();
  return mapToEntity(doc as (IUserDocument & { _id: { toString(): string } }) | null);
};

export const findAll = async (): Promise<(UserEntity | null)[]> => {
  const docs = await User.find({ deleted: false }).sort({ createdAt: -1 }).lean();
  return docs.map((doc) => mapToEntity(doc as IUserDocument & { _id: { toString(): string } }));
};

export interface ICreateUserData {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  status?: string;
}

export const createUser = async (data: ICreateUserData): Promise<UserEntity | null> => {
  const newUser = new User(data);
  const savedDoc = await newUser.save();
  return mapToEntity(savedDoc as IUserDocument & { _id: { toString(): string } });
};

export const updateStatus = async (id: string, status: string): Promise<UserEntity | null> => {
  const updatedDoc = await User.findOneAndUpdate({ _id: id }, { status }, { new: true });
  return mapToEntity(updatedDoc as (IUserDocument & { _id: { toString(): string } }) | null);
};
