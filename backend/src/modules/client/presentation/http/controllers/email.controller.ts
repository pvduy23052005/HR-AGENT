import { Request, Response } from 'express';

import { SendBulkEmailUseCase } from '../../../application/use-cases/email/send-bulk-email.use-case';

import { CandidateRepository } from '../../../infrastructure/database/repositories/candidate.repository';
import { JobRepository } from '../../../infrastructure/database/repositories/job.repository';
import { MailService } from '../../../infrastructure/external-service/mail.service';

const candidateRepository = new CandidateRepository();
const jobRepository = new JobRepository();
const mailService = new MailService();

// [POST] /email/send-bulk
export const sendBulkEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateIds, template, title, content } = req.body as {
      candidateIds: string[];
      template: { id: number; name: string };
      title: string;
      content: string;
    };

    const sendBulkEmailUseCase = new SendBulkEmailUseCase(
      candidateRepository,
      jobRepository,
      mailService,
    );

    const result = await sendBulkEmailUseCase.execute({
      candidateIds,
      template,
      title,
      content,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      totalSent: result.totalSent,
      totalCandidates: candidateIds.length,
      failed: result.failed,
    });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(400).json({
      success: false,
      message: e.message ?? 'Đã xảy ra lỗi khi gửi email hàng loạt.',
    });
  }
};
