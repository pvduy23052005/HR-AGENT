import type { CandidateEntity } from '../../../../domain/entities/client/candidate';
import type { ICandidateReadRepo } from '../../../../domain/repositories/client/candidate.interface';

export class GetCandidateDetailUseCase {
  constructor(private readonly candidateRepo: ICandidateReadRepo) { }

  async execute(candidateID: string): Promise<CandidateEntity | null> {
    return await this.candidateRepo.getCandidateById(candidateID);
  }
}
