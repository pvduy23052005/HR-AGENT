"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
        const objectId = new mongoose_1.default.Types.ObjectId(id);
        const candidate = await candidate_model_1.default.findOne({
            _id: objectId
        }).lean();
        return mapToEntity(candidate);
    }
    async getCandidates(userID) {
        const objectId = new mongoose_1.default.Types.ObjectId(userID);
        const selectedFields = "jobID status isVerify createdAt personal.fullName personal.email personal.phone personal.cvLink experiences projects";
        const candidates = await candidate_model_1.default.find({ addedBy: objectId }).select(selectedFields).lean();
        if (!candidates || candidates.length === 0)
            return null;
        return candidates
            .map((doc) => mapToEntity(doc))
            .filter((entity) => entity !== null);
    }
    async updateStatus(candidateID, status) {
        try {
            await candidate_model_1.default.updateOne({
                _id: candidateID
            }, {
                status: status.status
            });
        }
        catch (error) {
            console.log("Error update status", error);
        }
    }
}
exports.CandidateRepository = CandidateRepository;
//# sourceMappingURL=candidate.repository.js.map