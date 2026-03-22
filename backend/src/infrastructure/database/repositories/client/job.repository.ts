import Job from '../../models/job.model';
import { JobEntity } from '../../../../domain/entities/client/job';
import type { IJobReadRepo, IJobWriteRepo } from '../../../../domain/interfaces/client/job.interface';

const mapToEntity = (doc: any | null): JobEntity | null => {
  if (!doc) return null;
  const d = doc.toObject ? doc.toObject() : doc;
  return new JobEntity({
    id: (d._id as { toString(): string }).toString(),
    title: d.title,
    userID: d.userID?.toString(),
    description: d.description,
    requirements: d.requirements,
    status: d.status,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  });
};

export interface IJobData {
  title: string;
  userID: string;
  description: string;
  requirements: string[];
  status?: boolean;
}

export class JobRepository implements IJobReadRepo, IJobWriteRepo {
  public async createJob(data: IJobData): Promise<JobEntity | null> {
    const newJob = new Job(data);
    const savedJob = await newJob.save();
    return mapToEntity(savedJob);
  }

  public async getAllJob(userID: string): Promise<(JobEntity | null)[]> {
    const jobs = await Job.find({ userID, deleted: false }).lean();
    return jobs.map((j) => mapToEntity(j));
  }

  public async getJobById(id: string): Promise<JobEntity | null> {
    const job = await Job.findOne({ _id: id, deleted: false }).lean();
    return mapToEntity(job);
  }

  public async updateJobById(id: string, data: Partial<IJobData>): Promise<JobEntity | null> {
    const updatedJob = await Job.findOneAndUpdate({ _id: id, deleted: false }, data, { new: true });
    return mapToEntity(updatedJob);
  }

  public async deleteJobById(id: string): Promise<JobEntity | null> {
    const deletedJob = await Job.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true },
    );
    return mapToEntity(deletedJob);
  }
}
