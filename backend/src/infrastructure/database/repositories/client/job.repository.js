import Job from "../../models/job.model.js";
import { JobEntity } from "../../../../domain/entities/client/job.entity.js";

const mapToEntity = (jobDoc) => {
  if (!jobDoc) return null;

  const doc = jobDoc.toObject ? jobDoc.toObject() : jobDoc;

  return new JobEntity({
    id: doc._id,
    title: doc.title,
    userID: doc.userID,
    description: doc.description,
    requirements: doc.requirements,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};

export const createJob = async (data) => {
  const newJob = new Job(data);
  const savedJob = await newJob.save();

  return mapToEntity(savedJob);
};

export const getAllJob = async (userID) => {
  const jobs = await Job.find({
    userID: userID,
    deleted: false,
  }).lean();

  return jobs.map((job) => mapToEntity(job));
};

export const getJobById = async (id) => {
  const job = await Job.findOne({ _id: id, deleted: false }).lean();
  return mapToEntity(job);
};

export const updateJobById = async (id, data) => {
  const updatedJob = await Job.findOneAndUpdate(
    { _id: id, deleted: false },
    data,
    { new: true },
  );
  return mapToEntity(updatedJob);
};

export const deleteJobById = async (id) => {
  const deletedJob = await Job.findOneAndUpdate(
    { _id: id, deleted: false },
    { deleted: true },
    { new: true },
  );
  return mapToEntity(deletedJob);
};
