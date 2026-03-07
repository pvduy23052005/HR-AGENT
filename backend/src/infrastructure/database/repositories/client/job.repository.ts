import Job from '../../models/job.model';
import { JobEntity } from '../../../../domain/entities/client/job.entity';
import type { IJobDocument } from '../../models/job.model';

const mapToEntity = (doc: (IJobDocument & { _id: { toString(): string } }) | null): JobEntity | null => {
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
  requirements: string;
  status?: boolean;
}

export const createJob = async (data: IJobData): Promise<JobEntity | null> => {
  const newJob = new Job(data);
  const savedJob = await newJob.save();
  return mapToEntity(savedJob as IJobDocument & { _id: { toString(): string } });
};

export const getAllJob = async (userID: string): Promise<(JobEntity | null)[]> => {
  const jobs = await Job.find({ userID, deleted: false }).lean();
  return jobs.map((j) => mapToEntity(j as IJobDocument & { _id: { toString(): string } }));
};

export const getJobById = async (id: string): Promise<JobEntity | null> => {
  const job = await Job.findOne({ _id: id, deleted: false }).lean();
  return mapToEntity(job as (IJobDocument & { _id: { toString(): string } }) | null);
};

export const updateJobById = async (id: string, data: Partial<IJobData>): Promise<JobEntity | null> => {
  const updatedJob = await Job.findOneAndUpdate({ _id: id, deleted: false }, data, { new: true });
  return mapToEntity(updatedJob as (IJobDocument & { _id: { toString(): string } }) | null);
};

export const deleteJobById = async (id: string): Promise<JobEntity | null> => {
  const deletedJob = await Job.findOneAndUpdate(
    { _id: id, deleted: false },
    { deleted: true },
    { new: true },
  );
  return mapToEntity(deletedJob as (IJobDocument & { _id: { toString(): string } }) | null);
};
