"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourcingLeadRepository = void 0;
const sourcing_lead_model_1 = __importDefault(require("../../models/sourcing-lead.model"));
const sourcing_lead_entity_1 = require("../../../../domain/entities/client/sourcing-lead.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    return new sourcing_lead_entity_1.SourcingLeadEntity({
        id: doc._id.toString(),
        source: doc.source,
        name: doc.name,
        profileUrl: doc.profileUrl,
        avatarUrl: doc.avatarUrl,
        bio: doc.bio,
        location: doc.location,
        topSkills: doc.topSkills,
        jobTitle: doc.jobTitle,
        company: doc.company,
        email: doc.email,
        githubRepos: doc.githubRepos,
        githubStars: doc.githubStars,
        searchKeywords: doc.searchKeywords,
        jobID: doc.jobID?.toString(),
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
};
class SourcingLeadRepository {
    async create(data) {
        const existing = await sourcing_lead_model_1.default.findOne({ profileUrl: data.profileUrl }).lean();
        if (existing)
            return mapToEntity(existing);
        const doc = new sourcing_lead_model_1.default(data);
        const saved = await doc.save();
        return mapToEntity(saved);
    }
    async findAll(filters = {}) {
        const query = {};
        if (filters.jobID)
            query.jobID = filters.jobID;
        if (filters.source)
            query.source = filters.source;
        const docs = await sourcing_lead_model_1.default.find(query).sort({ createdAt: -1 }).lean();
        return docs.map(mapToEntity).filter((e) => e !== null);
    }
    async findById(id) {
        const doc = await sourcing_lead_model_1.default.findById(id).lean();
        return mapToEntity(doc);
    }
    async updateStatus(id, status) {
        const doc = await sourcing_lead_model_1.default.findByIdAndUpdate(id, { status }, { new: true }).lean();
        return mapToEntity(doc);
    }
    async deleteById(id) {
        const result = await sourcing_lead_model_1.default.findByIdAndDelete(id);
        return result !== null;
    }
    async existsByProfileUrl(profileUrl) {
        const count = await sourcing_lead_model_1.default.countDocuments({ profileUrl });
        return count > 0;
    }
}
exports.SourcingLeadRepository = SourcingLeadRepository;
//# sourceMappingURL=sourcing-lead.repository.js.map