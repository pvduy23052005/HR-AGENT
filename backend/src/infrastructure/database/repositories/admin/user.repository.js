import User from "../../models/user.model.js";
import { UserEntity } from "../../../../domain/entities/admin/user.entity.js";

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

export const findByEmail = async (email) => {
  const doc = await User.findOne({ email: email, deleted: false }).lean();

  return mapToEntity(doc);
};

export const findById = async (id) => {
  const doc = await User.findOne({ _id: id, deleted: false }).lean();
  return mapToEntity(doc);
};

export const findAll = async () => {
  const docs = await User.find({ deleted: false })
    .sort({ createdAt: -1 })
    .lean();

  return docs.map((doc) => mapToEntity(doc));
};

export const createUser = async (userEntityOrData) => {
  const newUser = new User(userEntityOrData);
  const savedDoc = await newUser.save();

  return mapToEntity(savedDoc);
};

export const updateStatus = async (id, status) => {
  const updatedDoc = await User.findOneAndUpdate(
    { _id: id },
    { status: status },
    { new: true },
  );

  return mapToEntity(updatedDoc);
};
