import mongoose, { Document } from 'mongoose';

export interface IAccountAdminDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  role_id: string;
  status: string;
  avatar: string;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new mongoose.Schema<IAccountAdminDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role_id: { type: String, default: 'admin' },
    status: { type: String, default: 'active' },
    avatar: { type: String, default: '' },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true },
);

const Account = mongoose.model<IAccountAdminDocument>('AccountAdmin', accountSchema, 'accountAdmins');

export default Account;
