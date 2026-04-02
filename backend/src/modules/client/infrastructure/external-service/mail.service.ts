import nodemailer from 'nodemailer';

import { IMailService } from '../../application/ports/services/mail.service';

export class MailService implements IMailService {
  public async sendEmail(
    toEmail: string,
    subject: string,
    htmlContent: string,
    attachments?: Array<{
      filename: string;
      content: Buffer;
      contentType?: string;
    }>,
  ): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.PASSWORD_USER,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: toEmail,
        subject,
        html: htmlContent,
        attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
      return true;
    } catch (error) {
      console.error('Send mail error: ', error);
      return false;
    }
  }
}
