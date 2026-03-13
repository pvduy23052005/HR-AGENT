"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const aiAnalysisSchema = new mongoose_1.default.Schema({
    jobID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    candidateID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    summary: { type: String, trim: true },
    matchingScore: { type: Number, min: 0, max: 100 },
    redFlags: [{ type: String, trim: true }],
    suggestedQuestions: [{ type: String }],
}, { timestamps: true });
const AiAnalysis = mongoose_1.default.model('AiAnalysis', aiAnalysisSchema);
exports.default = AiAnalysis;
//# sourceMappingURL=AiAnalysis.model.js.map