import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    matchingScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    redFlags: [
      {
        type: String,
      },
    ],
    suggestedQuestions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const AiAnalysis = mongoose.model("AiAnalysis", aiAnalysisSchema);

export default AiAnalysis;
