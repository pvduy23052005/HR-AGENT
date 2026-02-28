export const htmlEmailOtp = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
        <div style="text-align: center; border-bottom: 1px solid #eeeeee; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #333333; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Xác thực tài khoản</h1>
        </div>
        <div style="text-align: center; color: #555555; font-size: 16px; line-height: 1.6;">
          <p style="margin: 0 0 10px 0;">Xin chào,</p>
          <p style="margin: 0 0 20px 0;">Bạn đã yêu cầu đặt lại mật khẩu. Đây là mã OTP của bạn:</p>
          
          <div style="background-color: #e7f3ff; border: 1px dashed #007bff; display: inline-block; padding: 15px 30px; border-radius: 6px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; font-family: 'Courier New', monospace;">${otp}</span>
          </div>
          <p style="margin: 20px 0 5px 0; color: #d9534f; font-weight: bold;">Lưu ý:</p>
          <p style="margin: 0;">Mã này sẽ hết hạn trong vòng <strong style="color: #333;">60 giây</strong>.</p>
          <p style="font-size: 14px; margin-top: 10px; color: #888;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
        <div style="text-align: center; border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #999999; font-size: 12px;">
          <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} HR Agent. All rights reserved.</p>
          <p style="margin: 0;">Hệ thống tuyển dụng thông minh</p>
        </div>
      </div>
    </body>
    </html>
  `;
};