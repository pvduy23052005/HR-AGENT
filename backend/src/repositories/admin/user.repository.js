import User from "../../models/user.model.js";

export const findByEmail = async (email) => {
  return await User.findOne({
    email: email,
    deleted: false,
  });
};

export const createUser = async (data) => {
  const newUser = new User(data);
  return await newUser.save();
};

export const findAll = async () => {
  return await User.find({ deleted: false }).sort({ createdAt: -1 }).lean();
};

export const findById = async (id) => {
  return await User.findOne({ _id: id, deleted: false });
};

export const updateStatus = async (id, status) => {
  return await User.updateOne({ _id: id }, { status: status });
};