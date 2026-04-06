import type { IInterviewScheduleProps, IInterviewScheduleDetail } from './interviewSchedule.types';

export class InterviewScheduleEntity {
  private id: string;
  private time: Date;
  private status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  private address: string;
  private candidateId: string;
  private userId: string;
  private createdAt: Date | undefined;
  private updatedAt: Date | undefined;

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

  public getId(): string { return this.id; }
  public setId(value: string): void { this.id = value; }

  public getTime(): Date { return this.time; }
  public setTime(value: Date): void { this.time = value; }

  public getStatus(): 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' { return this.status; }
  public setStatus(value: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'): void { this.status = value; }

  public getAddress(): string { return this.address; }
  public setAddress(value: string): void { this.address = value; }

  public getCandidateId(): string { return this.candidateId; }
  public setCandidateId(value: string): void { this.candidateId = value; }

  public getUserId(): string { return this.userId; }
  public setUserId(value: string): void { this.userId = value; }

  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public setCreatedAt(value: Date | undefined): void { this.createdAt = value; }

  public getUpdatedAt(): Date | undefined { return this.updatedAt; }
  public setUpdatedAt(value: Date | undefined): void { this.updatedAt = value; }

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
