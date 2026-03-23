import InterviewSchedule from '../../models/interviewSchedule.model';
import { InterviewScheduleEntity } from '../../../../domain/entities/client/interviewSchedule';
import type {
  IInterviewScheduleData,
  IInterviewScheduleRepository,
} from '../../../../domain/interfaces/client/interviewSchedule.interface';

export class InterviewScheduleRepository implements IInterviewScheduleRepository {
  private mapToEntity(doc: any | null): InterviewScheduleEntity | null {
    if (!doc) return null;
    const d = doc as any;

    return new InterviewScheduleEntity({
      id: d._id.toString(),
      time: d.time,
      status: d.status,
      address: d.address,
      candidateId: d.candidateId?.toString(),
      userId: d.userId?.toString(),
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  }

  public async createSchedule(data: IInterviewScheduleData): Promise<InterviewScheduleEntity | null> {
    const newSchedule = new InterviewSchedule(data);
    const saved = await newSchedule.save();
    return this.mapToEntity(saved);
  }
}

