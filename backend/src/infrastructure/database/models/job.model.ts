import mongoose, { Document, Types } from 'mongoose';

export interface IJobDocument extends Document {
  title: string;
  userID: Types.ObjectId;
  description: string;
  requirements: string;
  status: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new mongoose.Schema<IJobDocument>(
  {
    title: { type: String, required: true, trim: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    status: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Job = mongoose.model<IJobDocument>('Job', jobSchema, 'jobs');

export default Job;
