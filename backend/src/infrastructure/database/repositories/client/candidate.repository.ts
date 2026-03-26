import mongoose from 'mongoose';
import Candidate from '../../models/candidate.model';
import { CandidateEntity } from '../../../../domain/entities/client/candidate';
import type { ICandidateReadRepo, ICandidateWriteRepo } from '../../../../domain/repositories/client/candidate.interface';
import type { IStatus } from '../../../../domain/repositories/client/candidate.interface';
import type { ICandidateData } from '../../../../domain/repositories/client/candidate.interface';

export class CandidateRepository implements ICandidateReadRepo, ICandidateWriteRepo {
  private mapToEntity(doc: any | null): CandidateEntity | null {
    if (!doc) return null;
    return new CandidateEntity({
      id: doc._id.toString(),
      jobID: doc.jobID?._id?.toString() ?? doc.jobID?.toString(),
      jobTitle: doc.jobID?.title ?? '',
      addedBy: doc.addedBy?.toString(),
      status: doc.status,
      verificationStatus: doc.verificationStatus,
      objective: doc.objective,
      fullTextContent: doc.fullTextContent,
      personal: doc.personal,
      educations: doc.educations,
      experiences: doc.experiences,
      projects: doc.projects,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public async createCandidate(data: ICandidateData): Promise<CandidateEntity | null> {
    const newCandidate = new Candidate(data);
    const savedCandidate = await newCandidate.save();
    return this.mapToEntity(savedCandidate);
  }

  public async getCandidateById(id: string): Promise<CandidateEntity | null> {
    const objectId = new mongoose.Types.ObjectId(id);
    const candidate = await Candidate.findOne({
      _id: objectId
    }).lean();
    return this.mapToEntity(candidate);
  }

  public async getCandidates(userID: string): Promise<CandidateEntity[] | null> {
    const objectId = new mongoose.Types.ObjectId(userID);
    const selectedFields = "jobID status isVerify createdAt personal.fullName personal.email personal.phone personal.cvLink experiences projects";
    const candidates = await Candidate.find({ addedBy: objectId })
      .select(selectedFields)
      .populate('jobID', 'title')
      .lean();
    if (!candidates || candidates.length === 0) return null;
    return candidates
      .map((doc) => this.mapToEntity(doc))
      .filter((entity): entity is CandidateEntity => entity !== null);
  }

  public async updateStatus(candidateID: string, updateData: IStatus): Promise<void> {
    try {
      const updateFields: any = {};

      if (updateData.status) {
        updateFields.status = updateData.status;
      }
      if (updateData.verificationStatus) {
        updateFields.verificationStatus = updateData.verificationStatus;
      }

      if (Object.keys(updateFields).length === 0) {
        throw new Error("Không có trường nào để cập nhật");
      }

      const result = await Candidate.updateOne({
        _id: candidateID
      }, updateFields);

      if (result.modifiedCount === 0) {
        throw new Error("Không thể cập nhật trạng thái ứng viên");
      }
    } catch (error) {
      console.error("Error update status", error);
      throw error;
    }
  }

  public async checkExistsCandidate(email: string): Promise<boolean> {
    const candidate = await Candidate.exists({ "personal.email": email });
    return candidate !== null;
  }

  public async updateCandidate(email: string, data: ICandidateData): Promise<CandidateEntity | null> {
    const candidate = await Candidate.findOneAndUpdate(
      { "personal.email": email },
      { $set: data },
      {
        new: true,
        runValidators: true
      });
    return this.mapToEntity(candidate);
  }

  public async countForStatistics(userId: string, startDate?: Date, endDate?: Date, status?: string): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const filter: any = { addedBy: objectId };
    if (status) filter.status = status;
    if (startDate && endDate) {
      if (status === 'offer') {
        filter.updatedAt = { $gte: startDate, $lt: endDate };
      } else {
        filter.createdAt = { $gte: startDate, $lt: endDate };
      }
    }
    return await Candidate.countDocuments(filter);
  }

  public async getForStatistics(userId: string, startDate?: Date, endDate?: Date, status?: string): Promise<{ createdAt?: Date, updatedAt?: Date }[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const filter: any = { addedBy: objectId };
    if (status) filter.status = status;
    if (startDate && endDate) {
      if (status === 'offer') {
        filter.updatedAt = { $gte: startDate, $lt: endDate };
      } else {
        filter.createdAt = { $gte: startDate, $lt: endDate };
      }
    }
    const selectField = status === 'offer' ? 'updatedAt' : 'createdAt';
    const docs = await Candidate.find(filter).select(selectField).lean();
    return docs as { createdAt?: Date, updatedAt?: Date }[];
  }
}


