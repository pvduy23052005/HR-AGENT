import User from "../../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({
    email: email,
    deleted: false,
  });
};

export const findUserByID = async (userID) => {
  return await User.findOne({
    _id: userID,
    deleted: false,
    status: "active"
  });
};

export const updateUserPassword = async (email, password) => {
  const user = await User.findOne({ email: email });
  user.password = password;
  return await user.save();
};
