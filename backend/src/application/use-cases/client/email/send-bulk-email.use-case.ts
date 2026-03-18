import type { ICandidateRepository } from '../../../../domain/interfaces/client/candidate.interface';
import type { IJobRepository } from '../../../../domain/interfaces/client/job.interface';
import type { IMailService } from '../../../../domain/interfaces/services/mail.service';

export interface SendBulkEmailInput {
  candidateIds: string[];
  template: {
    id: number;
    name: string;
  };
  title: string;
  content: string;
}

export interface SendBulkEmailResult {
  success: true;
  message: string;
  totalSent: number;
  failed: Array<{
    candidateId: string;
    candidateName?: string;
    error: string;
  }>;
}

export class SendBulkEmailUseCase {
  constructor(
    private readonly candidateRepo: ICandidateRepository,
    private readonly jobRepo: IJobRepository,
    private readonly mailSvc: IMailService,
  ) {}

  private replacePlaceholders(content: string, candidate: any, jobTitle?: string): string {
    let result = content;

    // Replace candidate placeholders
    if (candidate.personal?.fullName) {
      result = result.replace(/\[Tên Ứng Viên\]/g, candidate.personal.fullName);
      result = result.replace(/\[Tên Ứng viên\]/g, candidate.personal.fullName);
    }

    if (candidate.personal?.email) {
      result = result.replace(/\[Email\]/g, candidate.personal.email);
    }

    if (candidate.personal?.phone) {
      result = result.replace(/\[Điện thoại\]/g, candidate.personal.phone);
      result = result.replace(/\[SĐT\]/g, candidate.personal.phone);
    }

    // Replace job placeholders
    if (jobTitle) {
      result = result.replace(/\[Tên Vị Trí\]/g, jobTitle);
      result = result.replace(/\[Vị Trí\]/g, jobTitle);
    }

    // Replace company placeholder (can be customized)
    result = result.replace(/\[Công ty\]/g, process.env.COMPANY_NAME || 'công ty chúng tôi');

    return result;
  }

  async execute(input: SendBulkEmailInput): Promise<SendBulkEmailResult> {
    if (!input.candidateIds || input.candidateIds.length === 0) {
      throw new Error('Danh sách ứng viên không được để trống.');
    }

    if (!input.title?.trim()) {
      throw new Error('Tiêu đề email không được để trống.');
    }

    if (!input.content?.trim()) {
      throw new Error('Nội dung email không được để trống.');
    }

    const failed: Array<{
      candidateId: string;
      candidateName?: string;
      error: string;
    }> = [];
    let totalSent = 0;

    // Fetch all candidates
    const candidatePromises = input.candidateIds.map(id =>
      this.candidateRepo.getCandidateById(id)
    );
    const candidates = await Promise.all(candidatePromises);

    // Send emails
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const candidateId = input.candidateIds[i];

      try {
        if (!candidate) {
          failed.push({
            candidateId,
            error: 'Không tìm thấy ứng viên.',
          });
          continue;
        }

        if (!candidate.personal?.email) {
          failed.push({
            candidateId,
            candidateName: candidate.personal?.fullName,
            error: 'Ứng viên không có email.',
          });
          continue;
        }

        // Get job info if available
        let jobTitle: string | undefined;
        if (candidate.jobID) {
          try {
            const job = await this.jobRepo.getJobById(candidate.jobID.toString());
            jobTitle = job?.title;
          } catch (e) {
            console.warn(`Could not fetch job for candidate ${candidateId}`);
          }
        }

        // Replace placeholders
        const personalizedTitle = this.replacePlaceholders(input.title, candidate, jobTitle);
        const personalizedContent = this.replacePlaceholders(input.content, candidate, jobTitle);

        // Build HTML email
        const htmlContent = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                ${personalizedContent.split('\n').map(line => `<p>${line}</p>`).join('')}
              </div>
            </body>
          </html>
        `;

        // Send email
        const sent = await this.mailSvc.sendEmail(
          candidate.personal.email,
          personalizedTitle,
          htmlContent,
        );

        if (sent) {
          totalSent++;
        } else {
          failed.push({
            candidateId,
            candidateName: candidate.personal?.fullName,
            error: 'Lỗi gửi email từ dịch vụ mail.',
          });
        }
      } catch (error: unknown) {
        const e = error as { message?: string };
        failed.push({
          candidateId,
          candidateName: candidate?.personal?.fullName,
          error: e.message ?? 'Lỗi không xác định.',
        });
      }
    }

    return {
      success: true,
      message: `Gửi email thành công tới ${totalSent}/${input.candidateIds.length} ứng viên.`,
      totalSent,
      failed,
    };
  }
}
