import nodemailer from 'nodemailer';

export const sendEmail = async (
  toEmail: string,
  subject: string,
  htmlContent: string,
): Promise<boolean> => {
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
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Send mail error: ', error);
    return false;
  }
};
