import mongoose from 'mongoose';

const sourcingLeadSchema = new mongoose.Schema(
  {
    source: { type: String, enum: ['github', 'linkedin'], required: true },
    name: { type: String, trim: true, required: true },
    profileUrl: { type: String, trim: true, required: true, unique: true },
    avatarUrl: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    topSkills: [{ type: String, trim: true }],
    jobTitle: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    githubRepos: { type: Number, default: 0 },
    githubStars: { type: Number, default: 0 },
    searchKeywords: { type: String, trim: true, required: true },
    jobID: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
    status: { type: String, enum: ['new', 'contacted', 'rejected'], default: 'new' },
  },
  { timestamps: true },
);

const SourcingLead = mongoose.model('SourcingLead', sourcingLeadSchema);

export default SourcingLead;
