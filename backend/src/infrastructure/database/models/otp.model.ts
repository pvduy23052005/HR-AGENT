import mongoose, { Document } from 'mongoose';

export interface IOTPDocument extends Document {
  email: string;
  otp: string;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new mongoose.Schema<IOTPDocument>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 60 } },
  },
  { timestamps: true },
);

const OTP = mongoose.model<IOTPDocument>('OTP', otpSchema, 'otp');

export default OTP;
