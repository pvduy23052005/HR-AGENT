import User from '../models/user.model';
import { UserEntity } from '../../../domain/entities/user/user.entity';
import { IAuth } from '../../../application/ports/repositories/auth.interface';

export class AuthRepository implements IAuth {
  private mapToEntity(doc: any | null): UserEntity | null {
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
  }

  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await User.findOne({ email, deleted: false }).lean();
    return this.mapToEntity(user);
  }
}
