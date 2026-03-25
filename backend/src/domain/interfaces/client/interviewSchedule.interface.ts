import type { InterviewScheduleEntity } from '../../entities/client/interviewSchedule';


export interface IInterviewScheduleData {
  time: Date;
  address: string;
  candidateId: string;
  userId: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface IInterviewScheduleRepository {
  createSchedule(data: IInterviewScheduleData): Promise<InterviewScheduleEntity | null>;
  checkOverlap(userId: string, startTime: Date, durationMinutes: number): Promise<boolean>;
}
