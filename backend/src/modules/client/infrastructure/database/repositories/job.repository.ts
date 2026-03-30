import Job from '../models/job.model';
import { JobEntity } from '../../../domain/entities/job/job.entity';
import type { IJobReadRepo, IJobWriteRepo } from '../../../application/ports/repositories/job.interface';
import type { IJobData } from '../../../application/ports/repositories/job.interface';

export class JobRepository implements IJobReadRepo, IJobWriteRepo {
  private mapToEntity(doc: any | null): JobEntity | null {
    if (!doc) return null;
    const d = doc.toObject ? doc.toObject() : doc;
    return new JobEntity({
      id: d._id?.toString() || '',
      title: d.title,
      userID: d.userID?.toString() || '',
      description: d.description,
      requirements: d.requirements,
      status: d.status,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  }

  public async createJob(data: IJobData): Promise<JobEntity | null> {
    const newJob = new Job(data);
    const savedJob = await newJob.save();
    return this.mapToEntity(savedJob);
  }

  public async getAllJob(userID: string): Promise<JobEntity[]> {
    const data = await Job.find({ userID, deleted: false }).lean();

    const jobs = data.map(job => this.mapToEntity(job)).filter(job => job !== null);
    return jobs;
  }

  public async getJobById(id: string): Promise<JobEntity | null> {
    const job = await Job.findOne({
      _id: id,
      deleted: false
    }
    ).lean();
    return this.mapToEntity(job);
  }

  public async updateJobById(id: string, data: Partial<IJobData>): Promise<JobEntity | null> {
    const updatedJob = await Job.findOneAndUpdate({ _id: id, deleted: false }, data, { new: true });
    return this.mapToEntity(updatedJob);
  }

  public async deleteJobById(id: string): Promise<JobEntity | null> {
    const deletedJob = await Job.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true },
    );
    return this.mapToEntity(deletedJob);
  }
}
