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
