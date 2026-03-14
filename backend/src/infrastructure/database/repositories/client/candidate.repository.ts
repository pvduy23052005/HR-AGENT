import mongoose from 'mongoose';
import Candidate from '../../models/candidate.model';
import { CandidateEntity } from '../../../../domain/entities/client/candidate.entity';
import type { ICandidateRepository } from '../../../../domain/interfaces/client/candidate.interface';

const mapToEntity = (doc: any | null): CandidateEntity | null => {
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

export class CandidateRepository implements ICandidateRepository {
  public async createCandidate(data: ICandidateData): Promise<CandidateEntity | null> {
    const newCandidate = new Candidate(data);
    const savedCandidate = await newCandidate.save();
    return mapToEntity(savedCandidate);
  }

  public async getCandidateById(id: string): Promise<CandidateEntity | null> {
    const objectId = new mongoose.Types.ObjectId(id);
    const candidate = await Candidate.findOne({
      _id: objectId
    }).lean();
    return mapToEntity(candidate);
  }

  public async getCandidates(userID: string): Promise<CandidateEntity[] | null> {
    const objectId = new mongoose.Types.ObjectId(userID);
    const candidates = await Candidate.find({ addedBy: objectId });
    if (!candidates || candidates.length === 0) return null;
    return candidates
      .map((doc) => mapToEntity(doc))
      .filter((entity): entity is CandidateEntity => entity !== null);
  }
}
