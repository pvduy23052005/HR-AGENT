import type { IAiAnalysisRepository } from '../../../../domain/interfaces/client/aiAnalysis.interface';
import type { ICandidateRepository } from '../../../../domain/interfaces/client/candidate.interface';
import type { IInterviewScheduleRepository } from '../../../../domain/interfaces/client/interviewSchedule.interface';
import type { IJobRepository } from '../../../../domain/interfaces/client/job.interface';
import type { IInterviewScheduleDetail } from '../../../../domain/entities/client/interviewSchedule.entity';
import type { IGeminiService } from '../../../../domain/interfaces/services/gemini.service';
import type { IMailService } from '../../../../domain/interfaces/services/mail.service';
import { buildInterviewCalendarInvite } from '../../../../infrastructure/external-service/calendarInvite.service';

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
    private readonly candidateRepo: ICandidateRepository,
    private readonly jobRepo: IJobRepository,
    private readonly aiAnalysisRepo: IAiAnalysisRepository,
    private readonly interviewScheduleRepo: IInterviewScheduleRepository,
    private readonly geminiSvc: IGeminiService,
    private readonly mailSvc: IMailService,
  ) { }

  async execute(input: ScheduleInterviewInput): Promise<ScheduleInterviewResult> {
    const candidate = await this.candidateRepo.getCandidateById(input.candidateID);
    if (!candidate) throw new Error('Không tìm thấy thông tin ứng viên.');
    if (!candidate.personal.email) throw new Error('Ứng viên chưa có email để gửi thư mời.');

    const job = await this.jobRepo.getJobById(input.jobID);
    if (!job) throw new Error('Không tìm thấy thông tin công việc (Job).');

    const analysis = await this.aiAnalysisRepo.getAnalysisByCandidateId(input.candidateID);
    if (!analysis) throw new Error('Ứng viên chưa được AI phân tích. Vui lòng chạy phân tích trước khi đặt lịch.');

    const created = await this.interviewScheduleRepo.createSchedule({
      time: input.time,
      address: input.address,
      candidateId: input.candidateID,
      userId: input.userId,
      status: 'scheduled',
    });
    if (!created) throw new Error('Không thể tạo lịch phỏng vấn.');

    const invite = buildInterviewCalendarInvite({
      uid: `${created.id}@hr-agent`,
      startTime: input.time,
      durationMinutes: input.durationMinutes,
      summary: `Phỏng vấn - ${job.title}`,
      description: [
        `Phỏng vấn vị trí: ${job.title}`,
        `Ghi chú: ${input.notes ?? ''}`,
      ].filter(Boolean).join('\\n'),
      location: input.address,
      organizerEmail: process.env.MAIL_USER,
      attendeeEmail: candidate.personal.email,
    });

    const emailPayload = {
      candidate: {
        fullName: candidate.personal.fullName,
        email: candidate.personal.email,
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
    const subject = generated?.subject?.trim() || `Thư mời phỏng vấn - ${job.title}`;
    const html = generated?.html || `<p>Xin chào ${candidate.personal.fullName || 'bạn'},</p><p>Chúng tôi xin mời bạn tham gia phỏng vấn cho vị trí <b>${job.title}</b>.</p>`;

    const emailSent = await this.mailSvc.sendEmail(candidate.personal.email, subject, html, [
      {
        filename: invite.filename,
        content: invite.content,
        contentType: invite.contentType,
      },
    ]);

    await this.candidateRepo.updateStatus(input.candidateID, { status: "scheduled" });

    return { schedule: created.getDetail(), emailSent };
  }
}

