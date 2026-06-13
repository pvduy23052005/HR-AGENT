import type { IAnalysisReadRepo } from '../../../application/ports/repositories/analysis.interface';
import type { ICandidateReadRepo, ICandidateWriteRepo } from '../../../application/ports/repositories/candidate.interface';
import type { IInterviewScheduleRepository } from '../../../application/ports/repositories/interviewSchedule.interface';
import type { IJobReadRepo } from '../../../application/ports/repositories/job.interface';
import type { IUserReadRepo } from '../../../application/ports/repositories/user.interface';
import type { IInterviewScheduleDetail } from '../../../domain/interviewSchedule';
import type { IAIService } from '../../../application/ports/services/ai.service';
import type { IMailService } from '../../../application/ports/services/mail.service';
import type { EventManager } from '../../events/EventManager';
import type { InterviewEventMap } from '../../events/interview.events';

export type ScheduleInterviewInput = {
  userId: string;
  candidateID: string;
  jobID: string;
  time: Date;
  durationMinutes: number;
  address: string;
  notes?: string;
};

export type ScheduleInterviewResult = {
  schedule: IInterviewScheduleDetail;
  emailSent: boolean;
};

export class ScheduleInterviewUseCase {
  constructor(
    private readonly candidateRepo: ICandidateReadRepo & ICandidateWriteRepo,
    private readonly jobRepo: IJobReadRepo,
    private readonly aiAnalysisRepo: IAnalysisReadRepo,
    private readonly interviewScheduleRepo: IInterviewScheduleRepository,
    private readonly userRepo: IUserReadRepo,
    private readonly geminiSvc: IAIService,
    private readonly mailSvc: IMailService,
    private readonly eventManager: EventManager<InterviewEventMap>,
  ) { }

  async execute(input: ScheduleInterviewInput): Promise<ScheduleInterviewResult> {
    const candidate = await this.candidateRepo.getById(input.candidateID);
    if (!candidate) throw new Error('Khong tim thay thong tin ung vien.');
    if (!candidate.getPersonal().email) throw new Error('Ung vien chua co email de gui thu moi.');

    const job = await this.jobRepo.getById(input.jobID);
    if (!job) throw new Error('Khong tim thay thong tin cong viec (Job).');

    const analysis = await this.aiAnalysisRepo.getAnalysisByCandidateId(input.candidateID);
    if (!analysis) throw new Error('Ung vien chua duoc AI phan tich. Vui long chay phan tich truoc khi dat lich.');

    const isOverlap = await this.interviewScheduleRepo.checkOverlap(input.userId, input.time, input.durationMinutes);
    if (isOverlap) {
      throw new Error('Khung gio nay da co lich khac. Vui long chon gio lai.');
    }

    const created = await this.interviewScheduleRepo.createSchedule({
      time: input.time,
      address: input.address,
      candidateId: input.candidateID,
      userId: input.userId,
      status: 'scheduled',
    });
    if (!created) throw new Error('Khong the tao lich phong van.');

    await this.eventManager.notify('interview.scheduled', {
      ...input,
      schedule: created.getDetail(),
      candidateRepo: this.candidateRepo,
      jobRepo: this.jobRepo,
      aiAnalysisRepo: this.aiAnalysisRepo,
      interviewScheduleRepo: this.interviewScheduleRepo,
      userRepo: this.userRepo,
      geminiSvc: this.geminiSvc,
      mailSvc: this.mailSvc,
    });

    return { schedule: created.getDetail(), emailSent: true };
  }
}
