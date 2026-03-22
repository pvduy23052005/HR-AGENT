import User from '../../models/user.model';
import { UserEntity } from '../../../../domain/entities/client/user';
import type { IUserReadRepo, IUserWriteRepo } from '../../../../domain/interfaces/client/user.interface';

const mapToEntity = (doc: any | null): UserEntity | null => {
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

export class UserRepository implements IUserReadRepo, IUserWriteRepo {
  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    const doc = await User.findOne({ email, deleted: false }).lean();
    return mapToEntity(doc as any | null);
  }

  public async findUserByID(userID: string): Promise<UserEntity | null> {
    const doc = await User.findOne({ _id: userID, deleted: false, status: 'active' }).lean();
    return mapToEntity(doc as any | null);
  }

  public async updateUserPassword(email: string, password: string): Promise<UserEntity | null> {
    const updatedDoc = await User.findOneAndUpdate(
      { email },
      { password },
      { new: true },
    ).lean();
    return mapToEntity(updatedDoc as any | null);
  }
}
