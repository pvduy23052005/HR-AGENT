import type { IInterviewScheduleProps, IInterviewScheduleDetail } from './interviewSchedule.types';

export class InterviewScheduleEntity {
  id: string;
  time: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  address: string;
  candidateId: string;
  userId: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  constructor({
    id,
    time,
    status = 'scheduled',
    address,
    candidateId,
    userId,
    createdAt,
    updatedAt,
  }: IInterviewScheduleProps) {
    this.id = id ? id.toString() : '';
    this.time = time instanceof Date ? time : new Date(time);
    this.status = status;
    this.address = address ? address.trim() : '';
    this.candidateId = candidateId ? candidateId.toString() : '';
    this.userId = userId ? userId.toString() : '';
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getDetail(): IInterviewScheduleDetail {
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
