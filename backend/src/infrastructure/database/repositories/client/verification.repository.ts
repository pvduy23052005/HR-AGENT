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
    school: doc.school,
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
    
    const objectId = new mongoose.Types.ObjectId(candidateID);

    const saved = await Verification.findOneAndUpdate(
      { candidateId: objectId },
      { ...data, candidateId: objectId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return mapToVerificationEntity(saved);
  }

  public async updateIsverfiy(candidateID: string, isVerify: boolean): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(candidateID);
    await Candidate.updateOne({
      _id: objectId
    }, {
      isVerify: isVerify
    });
  }

  public async getVerificationByCandidateId(candidateID: string): Promise<VerificationEntity | null> {
    const objectId = new mongoose.Types.ObjectId(candidateID);
    const doc = await Verification.findOne({ candidateId: objectId }).lean();
    return mapToVerificationEntity(doc);
  }

  public async updateVerificationStatus(candidateID: string, isVerified: boolean): Promise<void> {
    try {
      const objectId = new mongoose.Types.ObjectId(candidateID);
      await Verification.updateOne(
        { candidateId: objectId },
        { isVerified: isVerified }
      );
    } catch (error) {
      console.log("Error updating verification status", error);
    }
  }
}
