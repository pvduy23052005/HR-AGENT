"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sourcingLeadSchema = new mongoose_1.default.Schema({
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
    jobID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Job', default: null },
    status: { type: String, enum: ['new', 'contacted', 'rejected'], default: 'new' },
}, { timestamps: true });
const SourcingLead = mongoose_1.default.model('SourcingLead', sourcingLeadSchema);
exports.default = SourcingLead;
//# sourceMappingURL=sourcing-lead.model.js.map