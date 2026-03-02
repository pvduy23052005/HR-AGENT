import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: 60 },
    },
  },
  {
    timestamps: true,
  },
);

const OTP = mongoose.model("OTP", otpSchema, "otp");

export default OTP;