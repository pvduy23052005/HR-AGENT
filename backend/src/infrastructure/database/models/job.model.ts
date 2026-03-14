import mongoose, { Types } from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' },
    requirements: { type: [String], default: [] },
    status: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Job = mongoose.model('Job', jobSchema, 'jobs');

export default Job;
