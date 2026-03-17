"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const personalSchema = new mongoose_1.default.Schema({
    fullName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String, trim: true },
    cvLink: { type: String, trim: true },
    githubLink: { type: String, trim: true },
    socialLinks: { type: Object },
}, { _id: false });
const educationSchema = new mongoose_1.default.Schema({
    school: { type: String, trim: true },
    degree: { type: String, trim: true },
    major: { type: String, trim: true },
    gpa: { type: String, trim: true },
    period: { type: String, trim: true },
}, { _id: false });
const experienceSchema = new mongoose_1.default.Schema({
    company: { type: String, trim: true },
    position: { type: String, trim: true },
    duration: { type: String, trim: true },
    description: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
}, { _id: false });
const projectSchema = new mongoose_1.default.Schema({
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
    projectLink: { type: String, trim: true },
}, { _id: false });
const candidateSchema = new mongoose_1.default.Schema({
    jobID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Job' },
    addedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ["unanalyzed", "scheduled", "analyzed", "risky"],
        default: "unanalyzed"
    },
    objective: { type: String, trim: true },
    fullTextContent: { type: String, trim: true },
    isVerify: {
        type: Boolean,
        default: false,
    },
    personal: personalSchema,
    educations: [educationSchema],
    experiences: [experienceSchema],
    projects: [projectSchema],
}, { timestamps: true });
const Candidate = mongoose_1.default.model('Candidate', candidateSchema);
exports.default = Candidate;
//# sourceMappingURL=candidate.model.js.map