"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewScheduleRepository = void 0;
const interviewSchedule_model_1 = __importDefault(require("../../models/interviewSchedule.model"));
const interviewSchedule_entity_1 = require("../../../../domain/entities/client/interviewSchedule.entity");
const mapToEntity = (doc) => {
    if (!doc)
        return null;
    const d = doc;
    return new interviewSchedule_entity_1.InterviewScheduleEntity({
        id: d._id.toString(),
        time: d.time,
        status: d.status,
        address: d.address,
        candidateId: d.candidateId?.toString(),
        userId: d.userId?.toString(),
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
    });
};
class InterviewScheduleRepository {
    async createSchedule(data) {
        const newSchedule = new interviewSchedule_model_1.default(data);
        const saved = await newSchedule.save();
        return mapToEntity(saved);
    }
}
exports.InterviewScheduleRepository = InterviewScheduleRepository;
//# sourceMappingURL=interviewSchedule.repository.js.map