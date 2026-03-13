"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewScheduleEntity = void 0;
class InterviewScheduleEntity {
    id;
    time;
    status;
    address;
    candidateId;
    userId;
    createdAt;
    updatedAt;
    constructor({ id, time, status = 'scheduled', address, candidateId, userId, createdAt, updatedAt, }) {
        this.id = id ? id.toString() : '';
        this.time = time instanceof Date ? time : new Date(time);
        this.status = status;
        this.address = address ? address.trim() : '';
        this.candidateId = candidateId ? candidateId.toString() : '';
        this.userId = userId ? userId.toString() : '';
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getDetail() {
        return {
            id: this.id,
            time: this.time,
            status: this.status,
            address: this.address,
            candidateId: this.candidateId,
            userId: this.userId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.InterviewScheduleEntity = InterviewScheduleEntity;
//# sourceMappingURL=interviewSchedule.entity.js.map