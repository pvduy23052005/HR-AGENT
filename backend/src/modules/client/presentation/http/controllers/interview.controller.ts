import { Request, Response } from 'express';
import { ScheduleInterviewUseCase } from '../../../application/use-cases/interview/schedule-interview.use-case';
import { AiAnalysisRepository } from '../../../infrastructure/database/repositories/aiAnalyze.repository';
import { CandidateRepository } from '../../../infrastructure/database/repositories/candidate.repository';
import { InterviewScheduleRepository } from '../../../infrastructure/database/repositories/interviewSchedule.repository';
import { JobRepository } from '../../../infrastructure/database/repositories/job.repository';
import { UserRepository } from '../../../infrastructure/database/repositories/user.repository';
import { GeminiService } from '../../../infrastructure/external-service/gemini.service';
import { MailService } from '../../../infrastructure/external-service/mail.service';
import { EventManager } from '../../../application/events/EventManager';
import type { InterviewEventMap } from '../../../application/events/interview.events';
import { InterviewCandidateEmailListener } from '../../../application/events/interviewCandidateEmail.listener';
import { InterviewCandidateStatusListener } from '../../../application/events/interviewCandidateStatus.listener';
import { InterviewHrNotificationListener } from '../../../application/events/interviewHrNotification.listener';

const candidateRepository = new CandidateRepository();
const jobRepository = new JobRepository();
const aiAnalysisRepository = new AiAnalysisRepository();
const interviewScheduleRepository = new InterviewScheduleRepository();
const userRepository = new UserRepository();
const geminiService = new GeminiService();
const mailService = new MailService();
const interviewEventManager = new EventManager<InterviewEventMap>();

interviewEventManager.subscribe('interview.scheduled', new InterviewCandidateEmailListener());
interviewEventManager.subscribe('interview.scheduled', new InterviewCandidateStatusListener());
interviewEventManager.subscribe('interview.scheduled', new InterviewHrNotificationListener());

const scheduleInterviewUseCase = new ScheduleInterviewUseCase(
  candidateRepository,
  jobRepository,
  aiAnalysisRepository,
  interviewScheduleRepository,
  userRepository,
  geminiService,
  mailService,
  interviewEventManager,
);

// [POST] /interview/schedule
export const scheduleInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user.id as string;
    const { candidateID, jobID, time, durationMinutes, address, notes } = req.body as {
      candidateID: string;
      jobID: string;
      time: string;
      durationMinutes?: number;
      address: string;
      notes?: string;
    };

    const result = await scheduleInterviewUseCase.execute({
      userId,
      candidateID,
      jobID,
      time: new Date(time),
      durationMinutes: durationMinutes ?? 60,
      address,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Đặt lịch phỏng vấn thành công.',
      schedule: result.schedule,
      emailSent: result.emailSent,
    });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({ success: false, message: e.message ?? 'Đã xảy ra lỗi khi đặt lịch phỏng vấn.' });
  }
};

