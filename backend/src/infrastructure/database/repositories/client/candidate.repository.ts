import mongoose from 'mongoose';
import Candidate from '../../models/candidate.model';
import { CandidateEntity } from '../../../../domain/entities/client/candidate';
import type { ICandidateReadRepo, ICandidateWriteRepo } from '../../../../domain/interfaces/client/candidate.interface';
import type { IStatus } from '../../../../domain/interfaces/client/candidate.interface';
import type { ICandidateData } from '../../../../domain/interfaces/client/candidate.interface';

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

export class CandidateRepository implements ICandidateReadRepo, ICandidateWriteRepo {
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
    const selectedFields = "jobID status isVerify createdAt personal.fullName personal.email personal.phone personal.cvLink experiences projects";
    const candidates = await Candidate.find({ addedBy: objectId }).select(selectedFields).lean();
    if (!candidates || candidates.length === 0) return null;
    return candidates
      .map((doc) => mapToEntity(doc))
      .filter((entity): entity is CandidateEntity => entity !== null);
  }

  public async updateStatus(candidateID: string, status: IStatus): Promise<void> {
    try {
      const result = await Candidate.updateOne({
        _id: candidateID
      }, {
        status: status.status
      });

      if (result.modifiedCount === 0) {
        throw new Error("Không thể cập nhật trạng thái ứng viên");
      }
    } catch (error) {
      console.error("Error update status", error);
      throw error;
    }
  }
}
