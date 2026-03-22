import SourcingLead from '../../models/sourcing-lead.model';
import { SourcingLeadEntity, SourcingSource, SourcingStatus } from '../../../../domain/entities/client/sourcing-lead';
import type { ISourcingLeadReadRepo, ISourcingLeadWriteRepo } from '../../../../domain/interfaces/client/sourcing-lead.interface';

export interface ISourcingLeadData {
  source: SourcingSource;
  name: string;
  profileUrl: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  topSkills?: string[];
  jobTitle?: string;
  company?: string;
  email?: string;
  githubRepos?: number;
  githubStars?: number;
  searchKeywords: string;
  jobID?: string;
  status?: SourcingStatus;
}

export class SourcingLeadRepository implements ISourcingLeadReadRepo, ISourcingLeadWriteRepo {
  private mapToEntity(doc: any): SourcingLeadEntity | null {
    if (!doc) return null;
    return new SourcingLeadEntity({
      id: doc._id.toString(),
      source: doc.source,
      name: doc.name,
      profileUrl: doc.profileUrl,
      avatarUrl: doc.avatarUrl,
      bio: doc.bio,
      location: doc.location,
      topSkills: doc.topSkills,
      jobTitle: doc.jobTitle,
      company: doc.company,
      email: doc.email,
      githubRepos: doc.githubRepos,
      githubStars: doc.githubStars,
      searchKeywords: doc.searchKeywords,
      jobID: doc.jobID?.toString(),
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public async create(data: ISourcingLeadData): Promise<SourcingLeadEntity | null> {
    const existing = await SourcingLead.findOne({ profileUrl: data.profileUrl }).lean();
    if (existing) return this.mapToEntity(existing);
    const doc = new SourcingLead(data);
    const saved = await doc.save();
    return this.mapToEntity(saved);
  }

  public async findAll(filters: { jobID?: string; source?: SourcingSource } = {}): Promise<SourcingLeadEntity[]> {
    const query: Record<string, any> = {};
    if (filters.jobID) query.jobID = filters.jobID;
    if (filters.source) query.source = filters.source;
    const docs = await SourcingLead.find(query).sort({ createdAt: -1 }).lean();
    return docs.map((d) => this.mapToEntity(d)).filter((e): e is SourcingLeadEntity => e !== null);
  }

  public async findById(id: string): Promise<SourcingLeadEntity | null> {
    const doc = await SourcingLead.findById(id).lean();
    return this.mapToEntity(doc);
  }

  public async updateStatus(id: string, status: SourcingStatus): Promise<SourcingLeadEntity | null> {
    const doc = await SourcingLead.findByIdAndUpdate(id, { status }, { new: true }).lean();
    return this.mapToEntity(doc);
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await SourcingLead.findByIdAndDelete(id);
    return result !== null;
  }

  public async existsByProfileUrl(profileUrl: string): Promise<boolean> {
    const count = await SourcingLead.countDocuments({ profileUrl });
    return count > 0;
  }
}
