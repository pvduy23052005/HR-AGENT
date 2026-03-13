"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const interviewScheduleSchema = new mongoose_1.default.Schema({
    time: { type: Date, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled',
    },
    address: { type: String, required: true, trim: true },
    candidateId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const InterviewSchedule = mongoose_1.default.model('InterviewSchedule', interviewScheduleSchema);
exports.default = InterviewSchedule;
//# sourceMappingURL=interviewSchedule.model.js.map