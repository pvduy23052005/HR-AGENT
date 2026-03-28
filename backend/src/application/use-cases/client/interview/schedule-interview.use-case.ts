import type { IAnalysisReadRepo } from '../../../../domain/repositories/client/analysis.interface';
import type { ICandidateReadRepo, ICandidateWriteRepo } from '../../../../domain/repositories/client/candidate.interface';
import type { IInterviewScheduleRepository } from '../../../../domain/repositories/client/interviewSchedule.interface';
import type { IJobReadRepo } from '../../../../domain/repositories/client/job.interface';
import type { IInterviewScheduleDetail } from '../../../../domain/entities/client/interviewSchedule';
import type { IAIService } from '../../../../domain/repositories/services/ai.service';
import type { IMailService } from '../../../../domain/repositories/services/mail.service';
import { buildInterviewCalendarInvite } from '../../../../infrastructure/external-service/calendarInvite.service';
import { CandidateStatus } from '../../../../domain/entities/client/candidate';

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
    private readonly geminiSvc: IAIService,
    private readonly mailSvc: IMailService,
  ) { }

  async execute(input: ScheduleInterviewInput): Promise<ScheduleInterviewResult> {
    const candidate = await this.candidateRepo.getCandidateById(input.candidateID);
    if (!candidate) throw new Error('Không tìm thấy thông tin ứng viên.');
    if (!candidate.getPersonal().email) throw new Error('Ứng viên chưa có email để gửi thư mời.');

    const job = await this.jobRepo.getJobById(input.jobID);
    if (!job) throw new Error('Không tìm thấy thông tin công việc (Job).');

    const analysis = await this.aiAnalysisRepo.getAnalysisByCandidateId(input.candidateID);
    if (!analysis) throw new Error('Ứng viên chưa được AI phân tích. Vui lòng chạy phân tích trước khi đặt lịch.');

    const isOverlap = await this.interviewScheduleRepo.checkOverlap(input.userId, input.time, input.durationMinutes);
    if (isOverlap) {
      throw new Error('Khung giờ này đã có lịch khác. Vui lòng chọn giờ lại');
    }

    const created = await this.interviewScheduleRepo.createSchedule({
      time: input.time,
      address: input.address,
      candidateId: input.candidateID,
      userId: input.userId,
      status: 'scheduled',
    });
    if (!created) throw new Error('Không thể tạo lịch phỏng vấn.');

    const invite = buildInterviewCalendarInvite({
      uid: `${created.getId()}@hr-agent`,
      startTime: input.time,
      durationMinutes: input.durationMinutes,
      summary: `Phỏng vấn - ${job.getTitle()}`,
      description: [
        `Phỏng vấn vị trí: ${job.getTitle()}`,
        `Ghi chú: ${input.notes ?? ''}`,
      ].filter(Boolean).join('\\n'),
      location: input.address,
      organizerEmail: process.env.MAIL_USER,
      attendeeEmail: candidate.getPersonal().email,
    });

    const emailPayload = {
      candidate: {
        fullName: candidate.getPersonal().fullName,
        email: candidate.getPersonal().email,
      },
      job: job.getDetailJob(),
      schedule: {
        time: input.time.toISOString(),
        durationMinutes: input.durationMinutes,
        address: input.address,
      },
      aiAnalysis: analysis.getDetail(),
      notes: input.notes ?? '',
    };

    const generated = await this.geminiSvc.generateInterviewEmail(emailPayload);
    const subject = generated?.subject?.trim() || `Thư mời phỏng vấn - ${job.getTitle()}`;
    const html = generated?.html || `<p>Xin chào ${candidate.getPersonal().fullName || 'bạn'},</p><p>Chúng tôi xin mời bạn tham gia phỏng vấn cho vị trí <b>${job.getTitle()}</b>.</p>`;

    const emailSent = await this.mailSvc.sendEmail(candidate.getPersonal().email, subject, html, [
      {
        filename: invite.filename,
        content: invite.content,
        contentType: invite.contentType,
      },
    ]);

    await this.candidateRepo.updateStatus(input.candidateID, { status: CandidateStatus.INTERVIEW });

    return { schedule: created.getDetail(), emailSent };
  }
}