import User from "../../models/user.model.js";
import { UserEntity } from "../../../../domain/entities/client/user.entity.js";

const mapToEntity = (doc) => {
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

export const findUserByEmail = async (email) => {
  const user = await User.findOne({
    email: email,
    deleted: false,
  }).lean();

  return mapToEntity(user);
};
