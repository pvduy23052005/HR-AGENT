import Account from "../../models/accountAdmin.model.js";
import { AdminEntity } from "../../../../domain/entities/admin/user.entity.js";

const maptoEntity = (document) => {
  if (!document) return null;

  return new AdminEntity({
    id: document._id.toString(),
    fullName: document.fullName,
    email: document.email,
    password: document.password,
    role: document.role || "",
    status: document.status,
    deleted: document.deleted,
  });
};

export const findAccountByEmail = async (email) => {
  const adminDoc = await Account.findOne({
    email: email,
    deleted: false,
  }).lean();

  return maptoEntity(adminDoc);
};

export const findAccountByID = async (ID) => {
  const adminDoc = await Account.findOne({
    _id: ID,
    deleted: false,
  }).lean();

  return maptoEntity(adminDoc);
};
