"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAnalysisRepository = void 0;
const AiAnalysis_model_1 = __importDefault(require("../../models/AiAnalysis.model"));
const aiAnalyize_entity_1 = require("../../../../domain/entities/client/aiAnalyize.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    const d = doc;
    return new aiAnalyize_entity_1.AiAnalyizeEntity({
        id: d._id.toString(),
        jobID: d.jobID?.toString(),
        candidateID: d.candidateID?.toString(),
        summary: d.summary,
        matchingScore: d.matchingScore,
        redFlags: d.redFlags,
        suggestedQuestions: d.suggestedQuestions,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
    });
};
class AiAnalysisRepository {
    async createAiAnalysis(data) {
        const newAnalysis = new AiAnalysis_model_1.default(data);
        const savedAnalysis = await newAnalysis.save();
        return mapToEntity(savedAnalysis);
    }
    async getAnalysisByCandidateId(candidateID) {
        const analysis = await AiAnalysis_model_1.default.findOne({ candidateID }).lean();
        return mapToEntity(analysis);
    }
}
exports.AiAnalysisRepository = AiAnalysisRepository;
//# sourceMappingURL=aiAnalyize.repository.js.map