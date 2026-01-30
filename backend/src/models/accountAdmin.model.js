import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
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
    role_id: {
      type: String,
      default: "admin",
    },
    status: {
      type: String,
      default: "active",
    },
    avatar: {
      type: String,
      default: "",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

const AccountAdmin = mongoose.model("AccountAdmin", accountSchema, "accountAdmins");

export default AccountAdmin;
