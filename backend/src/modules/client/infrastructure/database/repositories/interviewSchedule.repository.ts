import mongoose from 'mongoose';
import InterviewSchedule from '../models/interviewSchedule.model';
import { InterviewScheduleEntity } from '../../../domain/interviewSchedule/interviewSchedule.entity';
import type {
  IInterviewScheduleData,
  IInterviewScheduleRepository,
} from '../../../application/ports/repositories/interviewSchedule.interface';

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

  public async countForStatistics(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const filter: any = { userId: objectId };
    if (startDate && endDate) {
      filter.time = { $gte: startDate, $lt: endDate };
    }
    return await InterviewSchedule.countDocuments(filter);
  }

  public async getForStatistics(userId: string, startDate?: Date, endDate?: Date): Promise<{ time: Date }[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const filter: any = { userId: objectId };
    if (startDate && endDate) {
      filter.time = { $gte: startDate, $lt: endDate };
    }
    const docs = await InterviewSchedule.find(filter).select('time').lean();
    return docs as { time: Date }[];
  }
}

