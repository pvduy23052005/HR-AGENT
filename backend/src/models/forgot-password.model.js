import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema(
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
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

export default ForgotPassword;