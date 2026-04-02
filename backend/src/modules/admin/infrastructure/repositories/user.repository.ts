import User from '../../../client/infrastructure/database/models/user.model';
import { UserEntity } from '../../domain/entities/user.entity';
import { IReadUserRepository, IWriteUserRepository } from '../../application/ports/user.interface';

const mapToEntity = (doc: any | null): UserEntity | null => {
  if (!doc) return null;
  return UserEntity.restore({
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

export class UserRepository implements IReadUserRepository, IWriteUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await User.findOne({ email, deleted: false }).lean();
    return mapToEntity(doc);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await User.findOne({ _id: id, deleted: false }).lean();
    return mapToEntity(doc);
  }

  async findAll(): Promise<(UserEntity | null)[]> {
    const docs = await User.find({ deleted: false }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => mapToEntity(doc));
  }

  async create(user: UserEntity): Promise<UserEntity | null> {
    const data = user.getDetail();
    const newUser = new User(data);
    const savedDoc = await newUser.save();
    return mapToEntity(savedDoc);
  }

  async update(user: UserEntity): Promise<UserEntity | null> {
    const data = user.getDetail();
    const updatedDoc = await User.findOneAndUpdate({ _id: user.getId(), deleted: false }, data, { new: true }).lean();
    return mapToEntity(updatedDoc);
  }
}
