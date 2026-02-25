import User from "../../models/user.model.js";
import ForgotPassword from "../../models/forgot-password.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({
    email: email,
    deleted: false,
  });
};

export const findRecentOtp = async (email) => {
  return await ForgotPassword.findOne({
    email: email,
  }).sort({ createdAt: -1 });
};

export const createOtp = async (email, otp) => {
  const record = new ForgotPassword({
    email: email,
    otp: otp,
  });
  return await record.save();
};

export const findOtp = async (email, otp) => {
  return await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
};

export const findOtpByEmail = async (email) => {
  return await ForgotPassword.findOne({
    email: email,
  });
};

export const updateUserPassword = async (email, password) => {
  const user = await User.findOne({ email: email });
  user.password = password;
  return await user.save();
};

export const deleteOtp = async (email) => {
  return await ForgotPassword.deleteOne({ email: email });
};
