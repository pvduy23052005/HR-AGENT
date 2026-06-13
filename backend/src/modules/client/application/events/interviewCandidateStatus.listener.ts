import type { EventListener } from './EventManager';
import type { InterviewScheduledPayload } from './interview.events';
import { CandidateStatus } from '../../domain/candidate';

export class InterviewCandidateStatusListener implements EventListener<InterviewScheduledPayload> {
  async update(payload: InterviewScheduledPayload): Promise<void> {
    await payload.candidateRepo.updateStatus(payload.candidateID, {
      status: CandidateStatus.INTERVIEW,
    });
  }
}
