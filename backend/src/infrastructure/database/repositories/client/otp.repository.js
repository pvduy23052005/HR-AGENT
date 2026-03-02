import OTP from "../../models/otp.model.js";

export const findRecentOTP = async (email) => {
  return await OTP.findOne({
    email: email,
  }).sort({ createdAt: -1 });
};

export const createOTP = async (email, otp) => {
  const record = new OTP({
    email: email,
    otp: otp,
  });
  return await record.save();
};

export const findByEmailAndOTP = async (email, otp) => {
  return await OTP.findOne({
    email: email,
    otp: otp,
  });
};

export const findOTPByEmail = async (email) => {
  return await OTP.findOne({
    email: email,
  });
};

export const deleteOTP = async (email) => {
  return await OTP.deleteOne({ email: email });
};