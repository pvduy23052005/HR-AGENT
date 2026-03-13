import type { CandidateEntity } from '../../../../domain/entities/client/candidate.entity';
import type { ICandidateRepository } from '../../../../domain/interfaces/client/candidate.interface';

export class GetCandidatesUseCase {
  constructor(private readonly candidateRepo: ICandidateRepository) {}

  async execute(addedBy: string): Promise<CandidateEntity[] | null> {
    return await this.candidateRepo.getCandidates(addedBy);
  }
}