import User from "../../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({
    email: email,
    deleted: { $ne: true },
  });
};

export const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};
