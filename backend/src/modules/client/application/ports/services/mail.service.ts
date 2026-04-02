export interface IMailService {
  sendEmail(
    toEmail: string,
    subject: string,
    htmlContent: string,
    attachments?: Array<{
      filename: string;
      content: Buffer;
      contentType?: string;
    }>,
  ): Promise<boolean>;
}
