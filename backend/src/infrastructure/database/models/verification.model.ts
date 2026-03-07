import mongoose, { Document, Types } from 'mongoose';

export interface IVerificationDocument extends Document {
  candidateId: Types.ObjectId;
  isVerified: boolean;
  githubStars: number;
  topLanguages: string[];
  probedProjects?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const verificationSchema = new mongoose.Schema<IVerificationDocument>(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    isVerified: { type: Boolean, default: false },
    githubStars: { type: Number, default: 0 },
    topLanguages: [{ type: String }],
    probedProjects: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

const Verification = mongoose.model<IVerificationDocument>('Verification', verificationSchema);

export default Verification;
