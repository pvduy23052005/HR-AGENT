"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const verifycation_entity_1 = require("../../../../domain/entities/client/verifycation.entity");
const verification_model_1 = __importDefault(require("../../models/verification.model"));
const candidate_model_1 = __importDefault(require("../../models/candidate.model"));
const mapToVerificationEntity = (doc) => {
    if (!doc)
        return null;
    return new verifycation_entity_1.VerificationEntity({
        id: doc._id?.toString(),
        candidateId: doc.candidateId?.toString(),
        isVerified: doc.isVerified,
        name: doc.name,
        age: doc.age,
        phone: doc.phone,
        githubStars: doc.githubStars,
        topLanguages: doc.topLanguages,
        probedProjects: doc.probedProjects,
        aiReasoning: doc.aiReasoning,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
};
class VerificationRepository {
    async createVerification(candidateID, data) {
        const newVerification = new verification_model_1.default({ ...data, candidateId: candidateID });
        const saved = await newVerification.save();
        return mapToVerificationEntity(saved);
    }
    async updateIsverfiy(candidateID, isVerify) {
        await candidate_model_1.default.updateOne({
            _id: candidateID
        }, {
            isVerify: isVerify
        });
    }
    async getVerificationByCandidateId(candidateID) {
        const objectId = new mongoose_1.default.Types.ObjectId(candidateID);
        const doc = await verification_model_1.default.findOne({ candidateId: objectId }).lean();
        return mapToVerificationEntity(doc);
    }
}
exports.VerificationRepository = VerificationRepository;
//# sourceMappingURL=verification.repository.js.map