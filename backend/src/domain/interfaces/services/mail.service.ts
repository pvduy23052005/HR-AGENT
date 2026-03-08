export interface IMailService {
  sendEmail(toEmail: string, subject: string, htmlContent: string): Promise<boolean>;
}
