import Candidate from '../../models/candidate.model';
import { CandidateEntity } from '../../../../domain/entities/client/candidate.entity';
import type { ICandidateRepository } from '../../../../domain/interfaces/client/candidate.interface';
import { VerificationEntity } from '../../../../domain/entities/client/verifycation.entity';
import Verification from '../../models/verification.model';

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

const mapToVerificationEntity = (doc: any | null): VerificationEntity | null => {
  if (!doc) return null;
  return new VerificationEntity({
    id: doc._id?.toString(),
    candidateId: doc.candidateId?.toString(),
    isVerified: doc.isVerified,
    name: doc.name,
    age: doc.age,
    phone: doc.phone,
    githubStars: doc.githubStars,
    topLanguages: doc.topLanguages,
    probedProjects: doc.probedProjects,
    aiReasoning: doc.aiReasoning,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
};

export class CandidateRepository implements ICandidateRepository {
  public async createCandidate(data: ICandidateData): Promise<CandidateEntity | null> {
    const newCandidate = new Candidate(data);
    const savedCandidate = await newCandidate.save();
    return mapToEntity(savedCandidate);
  }

  public async getCandidateById(id: string): Promise<CandidateEntity | null> {
    const candidate = await Candidate.findById(id).lean();
    return mapToEntity(candidate);
  }

  public async getCandidates(addedBy: string): Promise<CandidateEntity[] | null> {
    const candidates = await Candidate.find({ addedBy }).lean();
    if (!candidates || candidates.length === 0) return null;
    return candidates
      .map((doc) => mapToEntity(doc))
      .filter((entity): entity is CandidateEntity => entity !== null);
  }

  public async createVerification(candidateID: string, data: any): Promise<VerificationEntity | null> {
    const newVerification = new Verification({ ...data, candidateId: candidateID });
    const saved = await newVerification.save();
    return mapToVerificationEntity(saved);
  }
}
