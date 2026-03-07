import mongoose, { Document, Types } from 'mongoose';

export interface IAiAnalysisDocument extends Document {
  jobID: Types.ObjectId;
  candidateID: Types.ObjectId;
  summary?: string;
  matchingScore?: number;
  redFlags: string[];
  suggestedQuestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const aiAnalysisSchema = new mongoose.Schema<IAiAnalysisDocument>(
  {
    jobID: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    candidateID: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    summary: { type: String, trim: true },
    matchingScore: { type: Number, min: 0, max: 100 },
    redFlags: [{ type: String, trim: true }],
    suggestedQuestions: [{ type: String }],
  },
  { timestamps: true },
);

const AiAnalysis = mongoose.model<IAiAnalysisDocument>('AiAnalysis', aiAnalysisSchema);

export default AiAnalysis;
