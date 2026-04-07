import type { ICandidateReadRepo } from '../../../application/ports/repositories/candidate.interface';
import type { IJobReadRepo } from '../../../application/ports/repositories/job.interface';
import type { IMailService } from '../../../application/ports/services/mail.service';

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
    private readonly candidateRepo: ICandidateReadRepo,
    private readonly jobRepo: IJobReadRepo,
    private readonly mailSvc: IMailService,
  ) { }

  private replacePlaceholders(content: string, candidate: any, jobTitle?: string): string {
    let result = content;

    const personal = candidate.getPersonal();
    if (personal?.fullName) {
      result = result.replace(/\[Tên Ứng Viên\]/g, personal.fullName);
      result = result.replace(/\[Tên Ứng viên\]/g, personal.fullName);
    }

    if (personal?.email) {
      result = result.replace(/\[Email\]/g, personal.email);
    }

    if (personal?.phone) {
      result = result.replace(/\[Điện thoại\]/g, personal.phone);
      result = result.replace(/\[SĐT\]/g, personal.phone);
    }

    if (jobTitle) {
      result = result.replace(/\[Tên Vị Trí\]/g, jobTitle);
      result = result.replace(/\[Vị Trí\]/g, jobTitle);
    }

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

    const candidatePromises = input.candidateIds.map(id =>
      this.candidateRepo.getById(id)
    );
    const candidates = await Promise.all(candidatePromises);

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const candidateId = input.candidateIds[i]!;

      try {
        if (!candidate) {
          failed.push({
            candidateId,
            error: 'Không tìm thấy ứng viên.',
          });
          continue;
        }

        const personal = candidate.getPersonal();
        if (!personal?.email) {
          failed.push({
            candidateId,
            candidateName: personal?.fullName,
            error: 'Ứng viên không có email.',
          });
          continue;
        }

        let jobTitle: string | undefined;
        const jobID = candidate.getJobID();
        if (jobID) {
          try {
            const job = await this.jobRepo.getById(jobID.toString());
            jobTitle = job?.getTitle();
          } catch (e) {
            console.warn(`Could not fetch job for candidate ${candidateId}`);
          }
        }

        const personalizedTitle = this.replacePlaceholders(input.title, candidate, jobTitle);
        const personalizedContent = this.replacePlaceholders(input.content, candidate, jobTitle);

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
          personal.email,
          personalizedTitle,
          htmlContent,
        );

        if (sent) {
          totalSent++;
        } else {
          failed.push({
            candidateId,
            candidateName: personal?.fullName,
            error: 'Lỗi gửi email từ dịch vụ mail.',
          });
        }
      } catch (error: unknown) {
        const e = error as { message?: string };
        const personal = candidate?.getPersonal();
        failed.push({
          candidateId,
          candidateName: personal?.fullName,
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
