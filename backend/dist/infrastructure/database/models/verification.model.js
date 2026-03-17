"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const verificationSchema = new mongoose_1.default.Schema({
    candidateId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
    githubStars: { type: Number, default: 0 },
    topLanguages: [{ type: String }],
    probedProjects: { type: mongoose_1.default.Schema.Types.Mixed },
    aiReasoning: {
        type: String
    }
}, { timestamps: true });
const Verification = mongoose_1.default.model('Verification', verificationSchema);
exports.default = Verification;
//# sourceMappingURL=verification.model.js.map