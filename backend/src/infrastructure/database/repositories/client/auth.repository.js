import User from "../../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({
    email: email,
    deleted: false,
  });
};