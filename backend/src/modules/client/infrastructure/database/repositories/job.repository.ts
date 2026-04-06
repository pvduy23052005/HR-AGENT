import Job from '../models/job.model';
import { JobEntity } from '../../../domain/job/job.entity';
import type { IJobReadRepo, IJobWriteRepo } from '../../../application/ports/repositories/job.interface';

export class JobRepository implements IJobReadRepo, IJobWriteRepo {
  private mapToEntity(doc: any | null): JobEntity | null {
    if (!doc) return null;
    const d = doc.toObject ? doc.toObject() : doc;
    return JobEntity.restore({
      id: d._id?.toString() || '',
      title: d.title,
      userID: d.userID?.toString() || '',
      description: d.description,
      requirements: d.requirements,
      status: d.status,
      deleted: d.deleted,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  }

  public async create(job: JobEntity): Promise<JobEntity | null> {
    const { id, ...data } = job.getDetailJob();
    const newJob = new Job(data);
    const savedJob = await newJob.save();
    return this.mapToEntity(savedJob);
  }

  public async getAll(userID: string): Promise<JobEntity[]> {
    const data = await Job.find({ userID, deleted: false }).lean();

    const jobs = data.map(job => this.mapToEntity(job)).filter(job => job !== null);
    return jobs;
  }

  public async getById(id: string): Promise<JobEntity | null> {
    const job = await Job.findOne({
      _id: id,
      deleted: false
    }
    ).lean();
    return this.mapToEntity(job);
  }

  public async update(job: JobEntity): Promise<JobEntity | null> {
    const { id, ...data } = job.getDetailJob();

    const updatedDoc = await Job.findOneAndUpdate(
      { _id: id, deleted: false },
      data,
      { new: true }
    ).lean();

    return this.mapToEntity(updatedDoc);
  }
}
