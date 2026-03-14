import type { ISourcingLeadRepository } from '../../../../domain/interfaces/client/sourcing-lead.interface';
import type { SourcingLeadEntity, SourcingSource } from '../../../../domain/entities/client/sourcing-lead.entity';

export interface IGetSourcingLeadsFilter {
  jobID?: string;
  source?: SourcingSource;
}

export class GetSourcingLeadsUseCase {
  constructor(private readonly sourcingLeadRepo: ISourcingLeadRepository) {}

  async execute(filters: IGetSourcingLeadsFilter = {}): Promise<SourcingLeadEntity[]> {
    return await this.sourcingLeadRepo.findAll(filters);
  }
}
