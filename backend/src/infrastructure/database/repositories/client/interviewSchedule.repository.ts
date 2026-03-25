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

  public async checkOverlap(userId: string, startTime: Date, durationMinutes: number): Promise<boolean> {
    // Check if there's any active interview that overlaps with [startTime - duration, startTime + duration]
    const startWindow = new Date(startTime.getTime() - (durationMinutes - 1) * 60000);
    const endWindow = new Date(startTime.getTime() + (durationMinutes - 1) * 60000);

    const overlap = await InterviewSchedule.exists({
      userId,
      status: { $in: ['scheduled', 'rescheduled'] },
      time: { $gte: startWindow, $lte: endWindow }
    });

    return overlap !== null;
  }
}

