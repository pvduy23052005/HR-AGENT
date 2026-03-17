import mongoose, { Types } from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true
    },
    isVerified: { type: Boolean, default: true },
    name: { type: String },
    age: { type: String },
    phone: { type: String },
    email: {
      type: String,
      default: ""
    },
    school: { type: String },
    githubStars: { type: Number, default: 0 },
    topLanguages: [{ type: String }],
    probedProjects: { type: mongoose.Schema.Types.Mixed },

    aiReasoning: {
      type: String
    }
  },
  { timestamps: true },
);

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;
