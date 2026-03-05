import Candidate from "../../models/candidate.model.js";
import { CandidateEntity } from "../../../../domain/entities/client/candidate.entity.js";

const mapToEntity = (doc) => {
  if (!doc) return null;

  return new CandidateEntity({
    id: doc._id,
    jobId: doc.jobId,
    addedBy: doc.addedBy,
    status: doc.status,
    objective: doc.objective,
    fullTextContent: doc.fullTextContent,
    personal: doc.personal,
    educations: doc.educations,
    experiences: doc.experiences,
    projects: doc.projects,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};

export const createCandidate = async (data) => {
  const sanitizedInput = new CandidateEntity(data);

  const { id, ...dataToSave } = sanitizedInput;

  const newCandidate = new Candidate(dataToSave);
  const savedCandidate = await newCandidate.save();

  return mapToEntity(savedCandidate);
};
