import type { CandidateEntity } from '../../../../domain/entities/client/candidate.entity';
import type { ICandidateRepository } from '../../../../domain/interfaces/client/candidate.interface';

export class GetCandidateDetailUseCase {
  constructor(private readonly candidateRepo: ICandidateRepository) { }

  async execute(candidateID: string): Promise<CandidateEntity | null> {
    return await this.candidateRepo.getCandidateById(candidateID);
  }
}
