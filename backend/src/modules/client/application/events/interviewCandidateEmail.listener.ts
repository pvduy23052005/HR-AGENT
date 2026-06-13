import type { EventListener } from './EventManager';
import type { InterviewScheduledPayload } from './interview.events';
import { buildInterviewCalendarInvite } from '../../infrastructure/external-service/calendarInvite.service';

export class InterviewCandidateEmailListener implements EventListener<InterviewScheduledPayload> {
  async update(payload: InterviewScheduledPayload): Promise<void> {
    const candidate = await payload.candidateRepo.getById(payload.candidateID);
    if (!candidate) throw new Error('Khong tim thay thong tin ung vien.');
    if (!candidate.getPersonal().email) throw new Error('Ung vien chua co email de gui thu moi.');

    const job = await payload.jobRepo.getById(payload.jobID);
    if (!job) throw new Error('Khong tim thay thong tin cong viec.');

    const analysis = await payload.aiAnalysisRepo.getAnalysisByCandidateId(payload.candidateID);
    if (!analysis) throw new Error('Ung vien chua duoc AI phan tich. Vui long chay phan tich truoc khi dat lich.');

    const invite = buildInterviewCalendarInvite({
      uid: `${payload.schedule.id ?? payload.candidateID}@hr-agent`,
      startTime: payload.time,
      durationMinutes: payload.durationMinutes,
      summary: `Phong van - ${job.getTitle()}`,
      description: [
        `Phong van vi tri: ${job.getTitle()}`,
        `Ghi chu: ${payload.notes ?? ''}`,
      ].filter(Boolean).join('\\n'),
      location: payload.address,
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
        time: payload.time.toISOString(),
        durationMinutes: payload.durationMinutes,
        address: payload.address,
      },
      aiAnalysis: analysis,
      notes: payload.notes ?? '',
    };

    const generated = await payload.geminiSvc.generateInterviewEmail(emailPayload);
    const subject = generated?.subject?.trim() || `Thu moi phong van - ${job.getTitle()}`;
    const html = generated?.html || `<p>Xin chao ${candidate.getPersonal().fullName || 'ban'},</p><p>Chung toi xin moi ban tham gia phong van cho vi tri <b>${job.getTitle()}</b>.</p>`;

    await payload.mailSvc.sendEmail(candidate.getPersonal().email, subject, html, [
      {
        filename: invite.filename,
        content: invite.content,
        contentType: invite.contentType,
      },
    ]);
  }
}
