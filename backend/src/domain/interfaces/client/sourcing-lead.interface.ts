import type { SourcingLeadEntity, SourcingSource, SourcingStatus } from '../../entities/client/sourcing-lead';
import type { ISourcingLeadData } from '../../../infrastructure/database/repositories/client/sourcing-lead.repository';

export interface ISourcingLeadReadRepo {
  findAll(filters?: { jobID?: string; source?: SourcingSource }): Promise<SourcingLeadEntity[]>;

  findById(id: string): Promise<SourcingLeadEntity | null>;

  existsByProfileUrl(profileUrl: string): Promise<boolean>;
}

export interface ISourcingLeadWriteRepo {
  create(data: ISourcingLeadData): Promise<SourcingLeadEntity | null>;

  updateStatus(id: string, status: SourcingStatus): Promise<SourcingLeadEntity | null>;

  deleteById(id: string): Promise<boolean>;
}
