import { Request, Response } from 'express';
import { ScheduleInterviewUseCase } from '../../../../application/use-cases/client/interview/schedule-interview.use-case';
import { AiAnalysisRepository } from '../../../../infrastructure/database/repositories/client/aiAnalyize.repository';
import { CandidateRepository } from '../../../../infrastructure/database/repositories/client/candidate.repository';
import { InterviewScheduleRepository } from '../../../../infrastructure/database/repositories/client/interviewSchedule.repository';
import { JobRepository } from '../../../../infrastructure/database/repositories/client/job.repository';
import { GeminiService } from '../../../../infrastructure/external-service/gemini.service';
import { MailService } from '../../../../infrastructure/external-service/mail.service';

const candidateRepository = new CandidateRepository();
const jobRepository = new JobRepository();
const aiAnalysisRepository = new AiAnalysisRepository();
const interviewScheduleRepository = new InterviewScheduleRepository();
const geminiService = new GeminiService();
const mailService = new MailService();

const scheduleInterviewUseCase = new ScheduleInterviewUseCase(
  candidateRepository,
  jobRepository,
  aiAnalysisRepository,
  interviewScheduleRepository,
  geminiService,
  mailService,
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

