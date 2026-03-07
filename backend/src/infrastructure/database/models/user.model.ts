import mongoose, { Document } from 'mongoose';

export interface IUserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  status: 'active' | 'inactive';
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    deleted: { type: Boolean },
    deletedAt: Date,
  },
  { timestamps: true },
);

const User = mongoose.model<IUserDocument>('User', userSchema, 'users');

export default User;
