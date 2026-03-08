import User from '../../models/user.model';
import { UserEntity } from '../../../../domain/entities/client/user.entity';

const mapToEntity = (doc: any | null): UserEntity | null => {
  if (!doc) return null;
  const d = doc as any;

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

import { IAuth } from '../../../../domain/interfaces/client/auth.interface';

export class AuthRepository implements IAuth {
  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await User.findOne({ email, deleted: false }).lean();
    return mapToEntity(user);
  }
}
