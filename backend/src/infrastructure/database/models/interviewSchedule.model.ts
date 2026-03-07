import mongoose, { Document, Types } from 'mongoose';

export interface IInterviewScheduleDocument extends Document {
  time: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  address: string;
  candidateId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const interviewScheduleSchema = new mongoose.Schema<IInterviewScheduleDocument>(
  {
    time: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },
    address: { type: String, required: true, trim: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const InterviewSchedule = mongoose.model<IInterviewScheduleDocument>(
  'InterviewSchedule',
  interviewScheduleSchema,
);

export default InterviewSchedule;
