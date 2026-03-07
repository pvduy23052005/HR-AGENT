import Candidate from '../../models/candidate.model';
import { CandidateEntity } from '../../../../domain/entities/client/candidate.entity';
import type { ICandidateDocument } from '../../models/candidate.model';

const mapToEntity = (doc: (ICandidateDocument & { _id: { toString(): string } }) | null): CandidateEntity | null => {
  if (!doc) return null;
  return new CandidateEntity({
    id: doc._id.toString(),
    jobID: doc.jobID?.toString(),
    addedBy: doc.addedBy?.toString(),
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

export interface ICandidateData {
  jobID?: string;
  addedBy?: string;
  status?: boolean;
  objective?: string;
  fullTextContent?: string;
  personal?: Record<string, unknown>;
  educations?: unknown[];
  experiences?: unknown[];
  projects?: unknown[];
}

export const createCandidate = async (data: ICandidateData): Promise<CandidateEntity | null> => {
  const newCandidate = new Candidate(data);
  const savedCandidate = await newCandidate.save();
  return mapToEntity(savedCandidate as ICandidateDocument & { _id: { toString(): string } });
};

export const getCandidateById = async (id: string): Promise<CandidateEntity | null> => {
  const candidate = await Candidate.findById(id).lean();
  return mapToEntity(candidate as (ICandidateDocument & { _id: { toString(): string } }) | null);
};
