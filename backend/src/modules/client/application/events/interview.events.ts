import type { IAnalysisReadRepo } from '../ports/repositories/analysis.interface';
import type { ICandidateReadRepo, ICandidateWriteRepo } from '../ports/repositories/candidate.interface';
import type { IInterviewScheduleRepository } from '../ports/repositories/interviewSchedule.interface';
import type { IJobReadRepo } from '../ports/repositories/job.interface';
import type { IUserReadRepo } from '../ports/repositories/user.interface';
import type { IAIService } from '../ports/services/ai.service';
import type { IMailService } from '../ports/services/mail.service';
import type { IInterviewScheduleDetail } from '../../domain/interviewSchedule';

export type InterviewScheduledPayload = {
  userId: string;
  candidateID: string;
  jobID: string;
  time: Date;
  durationMinutes: number;
  address: string;
  notes?: string;
  schedule: IInterviewScheduleDetail;
  candidateRepo: ICandidateReadRepo & ICandidateWriteRepo;
  jobRepo: IJobReadRepo;
  aiAnalysisRepo: IAnalysisReadRepo;
  interviewScheduleRepo: IInterviewScheduleRepository;
  userRepo: IUserReadRepo;
  geminiSvc: IAIService;
  mailSvc: IMailService;
};

export type InterviewEventMap = {
  'interview.scheduled': InterviewScheduledPayload;
};
