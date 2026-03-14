import mongoose from 'mongoose';
import { VerificationEntity } from '../../../../domain/entities/client/verifycation.entity';
import type { IVerificationRepository } from '../../../../domain/interfaces/client/verification.interface';
import Verification from '../../models/verification.model';
import Candidate from '../../models/candidate.model';

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

export class VerificationRepository implements IVerificationRepository {
  public async createVerification(candidateID: string, data: any): Promise<VerificationEntity | null> {
    const newVerification = new Verification({ ...data, candidateId: candidateID });
    const saved = await newVerification.save();
    return mapToVerificationEntity(saved);
  }

  public async updateIsverfiy(candidateID: string, isVerify: boolean): Promise<void> {
    await Candidate.updateOne({
      _id: candidateID
    }, {
      isVerify: isVerify
    });
  }

  public async getVerificationByCandidateId(candidateID: string): Promise<VerificationEntity | null> {
    const objectId = new mongoose.Types.ObjectId(candidateID);
    const doc = await Verification.findOne({ candidateId: objectId }).lean();
    return mapToVerificationEntity(doc);
  }
}
