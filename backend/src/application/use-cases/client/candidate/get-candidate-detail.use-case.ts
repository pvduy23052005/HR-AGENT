import type { CandidateEntity } from '../../../../domain/entities/client/candidate.entity';
import type { ICandidateReadRepo } from '../../../../domain/interfaces/client/candidate.interface';

export class GetCandidateDetailUseCase {
  constructor(private readonly candidateRepo: ICandidateReadRepo) {}

  async execute(candidateID: string): Promise<CandidateEntity | null> {
    return await this.candidateRepo.getCandidateById(candidateID);
  }
}
