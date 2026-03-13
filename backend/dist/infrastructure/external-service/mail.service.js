"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailService {
    async sendEmail(toEmail, subject, htmlContent, attachments) {
        try {
            const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (error) {
            console.error('Send mail error: ', error);
            return false;
        }
    }
}
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map