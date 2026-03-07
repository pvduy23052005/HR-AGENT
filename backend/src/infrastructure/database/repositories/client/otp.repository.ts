import OTP from '../../models/otp.model';
import { OTPEntity } from '../../../../domain/entities/client/otp.entity';
import type { IOTPDocument } from '../../models/otp.model';

const mapToEntity = (doc: (IOTPDocument & { _id: { toString(): string } }) | null): OTPEntity | null => {
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

export const findRecentOTP = async (email: string): Promise<OTPEntity | null> => {
  const doc = await OTP.findOne({ email }).sort({ createdAt: -1 }).lean();
  return mapToEntity(doc as (IOTPDocument & { _id: { toString(): string } }) | null);
};

export const createOTP = async (email: string, otp: string): Promise<OTPEntity | null> => {
  const record = new OTP({ email, otp });
  const savedDoc = await record.save();
  return mapToEntity(savedDoc as IOTPDocument & { _id: { toString(): string } });
};

export const findByEmailAndOTP = async (email: string, otp: string): Promise<OTPEntity | null> => {
  const doc = await OTP.findOne({ email, otp }).lean();
  return mapToEntity(doc as (IOTPDocument & { _id: { toString(): string } }) | null);
};

export const findOTPByEmail = async (email: string): Promise<OTPEntity | null> => {
  const doc = await OTP.findOne({ email }).lean();
  return mapToEntity(doc as (IOTPDocument & { _id: { toString(): string } }) | null);
};

export const deleteOTP = async (email: string): Promise<{ deletedCount?: number }> => {
  return await OTP.deleteOne({ email });
};
