import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    deleted: {
      type: Boolean,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema, "users");

export default User;
