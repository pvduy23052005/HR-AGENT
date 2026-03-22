import type { InterviewScheduleEntity } from '../../entities/client/interviewSchedule.entity';


export interface IInterviewScheduleData {
  time: Date;
  address: string;
  candidateId: string;
  userId: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface IInterviewScheduleRepository {
  createSchedule(data: IInterviewScheduleData): Promise<InterviewScheduleEntity | null>;
}
