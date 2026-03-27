import type { CandidateEntity } from '../../../../domain/entities/client/candidate';
import type { ICandidateReadRepo } from '../../../../domain/repositories/client/candidate.interface';

export class GetCandidatesUseCase {
  constructor(private readonly candidateRepo: ICandidateReadRepo) { }

  async execute(userID: string): Promise<CandidateEntity[] | null> {
    return await this.candidateRepo.getCandidates(userID);
  }
}