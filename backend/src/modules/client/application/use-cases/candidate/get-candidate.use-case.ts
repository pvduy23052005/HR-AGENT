import type { CandidateEntity } from '../../../domain/entities/candidate';
import type { ICandidateReadRepo } from '../../../application/ports/repositories/candidate.interface';

export class GetCandidatesUseCase {
  constructor(private readonly candidateRepo: ICandidateReadRepo) { }

  async execute(userID: string): Promise<CandidateEntity[] | null> {

    const candidates = await this.candidateRepo.getCandidates(userID);

    return candidates;
  }
}