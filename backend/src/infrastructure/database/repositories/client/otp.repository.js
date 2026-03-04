import OTP from "../../models/otp.model.js";
import { OTPEntity } from "../../../../domain/entities/client/otp.enity.js";

const mapToEntity = (doc) => {
  if (!doc) return null;

  return new OTPEntity({
    id: doc._id.toString(),
    email: doc.email,
    otp: doc.otp,
    expireAt: doc.expireAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};


export const findRecentOTP = async (email) => {
  const doc = await OTP.findOne({ email }).sort({ createdAt: -1 }).lean();
  return mapToEntity(doc);
};

export const createOTP = async (email, otp) => {
  const record = new OTP({ email, otp });
  const savedDoc = await record.save();
  return mapToEntity(savedDoc);
};

export const findByEmailAndOTP = async (email, otp) => {
  const doc = await OTP.findOne({ email, otp }).lean();
  return mapToEntity(doc);
};

export const findOTPByEmail = async (email) => {
  const doc = await OTP.findOne({ email }).lean();
  return mapToEntity(doc);
};

export const deleteOTP = async (email) => {
  return await OTP.deleteOne({ email });
};