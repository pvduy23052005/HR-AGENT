import type { EventListener } from './EventManager';
import type { InterviewScheduledPayload } from './interview.events';

export class InterviewHrNotificationListener implements EventListener<InterviewScheduledPayload> {
  async update(payload: InterviewScheduledPayload): Promise<void> {
    const hr = await payload.userRepo.findUserByID(payload.userId);
    if (!hr || !hr.getInterviewNotificationSubscribed()) return;

    const candidate = await payload.candidateRepo.getById(payload.candidateID);
    const job = await payload.jobRepo.getById(payload.jobID);

    const candidateName = candidate?.getPersonal().fullName || 'ung vien';
    const jobTitle = job?.getTitle() || 'vi tri tuyen dung';
    const interviewTime = payload.time.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    await payload.mailSvc.sendEmail(
      hr.getEmail(),
      `Thong bao lich phong van - ${candidateName}`,
      `
        <p>Xin chao ${hr.getFullName() || 'HR'},</p>
        <p>Lich phong van moi da duoc dat thanh cong.</p>
        <ul>
          <li>Ung vien: <b>${candidateName}</b></li>
          <li>Vi tri: <b>${jobTitle}</b></li>
          <li>Thoi gian: <b>${interviewTime}</b></li>
          <li>Dia diem / link: <b>${payload.address}</b></li>
        </ul>
      `,
    );
  }
}
