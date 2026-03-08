import mongoose, { Types } from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema(
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

const AiAnalysis = mongoose.model('AiAnalysis', aiAnalysisSchema);

export default AiAnalysis;
