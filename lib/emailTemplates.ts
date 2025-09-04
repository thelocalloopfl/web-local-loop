export function passwordResetTemplate(userName: string, resetLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #FFF4E6; padding: 20px; text-align: center; border-bottom: 3px solid #f97316;">
        <h2 style="color: #f97316; margin: 0;">The Local Loop FL</h2>
      </div>
      
      <div style="padding: 30px; background: #ffffff;">
        <h3 style="color: #333; margin-top: 0;">Password Reset Request</h3>
        
        <p>Dear ${userName || "Valued Customer"},</p>
        
        <p>We received a request to reset your password for your <strong>The Local Loop FL</strong> account. 
           To proceed, please click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #f97316; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; display: inline-block; 
                    font-weight: bold;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Important:</strong> This password reset link will expire in 15 minutes 
          for security reasons. If you did not request this reset, you can ignore this email.
        </p>
        
        <p>Best regards,<br>
        <strong>The Local Loop FL Team</strong></p>
      </div>
      
      <div style="background: #FFF4E6; padding: 20px; text-align: center; 
                  font-size: 12px; color: #666; border-top: 1px solid #ddd;">
        <p>© ${new Date().getFullYear()} The Local Loop FL. All rights reserved.</p>
        <p>This is an automated message - please do not reply.</p>
      </div>
    </div>
  `;
}
