"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateRepository = void 0;
const candidate_model_1 = __importDefault(require("../../models/candidate.model"));
const candidate_entity_1 = require("../../../../domain/entities/client/candidate.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    return new candidate_entity_1.CandidateEntity({
        id: doc._id.toString(),
        jobID: doc.jobID?.toString(),
        addedBy: doc.addedBy?.toString(),
        status: doc.status,
        objective: doc.objective,
        fullTextContent: doc.fullTextContent,
        personal: doc.personal,
        educations: doc.educations,
        experiences: doc.experiences,
        projects: doc.projects,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
};
class CandidateRepository {
    async createCandidate(data) {
        const newCandidate = new candidate_model_1.default(data);
        const savedCandidate = await newCandidate.save();
        return mapToEntity(savedCandidate);
    }
    async getCandidateById(id) {
        const candidate = await candidate_model_1.default.findById(id).lean();
        return mapToEntity(candidate);
    }
    async getCandidates() {
        const candidates = await candidate_model_1.default.find().lean();
        if (!candidates || candidates.length === 0)
            return null;
        return candidates
            .map((doc) => mapToEntity(doc))
            .filter((entity) => entity !== null);
    }
}
exports.CandidateRepository = CandidateRepository;
//# sourceMappingURL=candidate.repository.js.map