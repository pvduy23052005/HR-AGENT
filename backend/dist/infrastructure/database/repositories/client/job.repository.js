"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const job_model_1 = __importDefault(require("../../models/job.model"));
const job_entity_1 = require("../../../../domain/entities/client/job.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    const d = doc.toObject ? doc.toObject() : doc;
    return new job_entity_1.JobEntity({
        id: d._id.toString(),
        title: d.title,
        userID: d.userID?.toString(),
        description: d.description,
        requirements: d.requirements,
        status: d.status,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
    });
};
class JobRepository {
    async createJob(data) {
        const newJob = new job_model_1.default(data);
        const savedJob = await newJob.save();
        return mapToEntity(savedJob);
    }
    async getAllJob(userID) {
        const jobs = await job_model_1.default.find({ userID, deleted: false }).lean();
        return jobs.map((j) => mapToEntity(j));
    }
    async getJobById(id) {
        const job = await job_model_1.default.findOne({ _id: id, deleted: false }).lean();
        return mapToEntity(job);
    }
    async updateJobById(id, data) {
        const updatedJob = await job_model_1.default.findOneAndUpdate({ _id: id, deleted: false }, data, { new: true });
        return mapToEntity(updatedJob);
    }
    async deleteJobById(id) {
        const deletedJob = await job_model_1.default.findOneAndUpdate({ _id: id, deleted: false }, { deleted: true }, { new: true });
        return mapToEntity(deletedJob);
    }
}
exports.JobRepository = JobRepository;
//# sourceMappingURL=job.repository.js.map