export function passwordResetTemplate(userName: string, resetLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden; background-color: #ffffff;">

      <!-- Header -->
      <div style="background: #FFF4E6; padding: 25px 20px; text-align: center; border-bottom: 3px solid #f97316;">
        <h2 style="color: #f97316; margin: 0; font-size: 24px;">🔒 Password Reset Request</h2>
        <p style="color: #555; margin-top: 5px; font-size: 14px;">A secure way to regain access to your account.</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px; margin-bottom: 15px;">
          Hello <strong>${userName || "Valued Customer"}</strong>,
        </p>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
          We received a request to reset your password for your 
          <strong>The Local Loop FL</strong> account. Please click the button below to set a new password securely.
        </p>

        <!-- Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}"
             style="background-color: #f97316; color: #ffffff; padding: 14px 30px;
                    text-decoration: none; border-radius: 8px; display: inline-block;
                    font-weight: bold; font-size: 16px; box-shadow: 0 3px 6px rgba(0,0,0,0.1);">
            Reset Password
          </a>
        </div>

        <!-- Info Box -->
        <div style="background-color: #fafafa; border-left: 4px solid #f97316; padding: 15px 20px; border-radius: 6px; margin-bottom: 25px;">
          <p style="font-size: 14px; color: #555; margin: 0;">
            ⚠️ <strong>Security Notice:</strong> This link will expire in <strong>15 minutes</strong> for your protection.
            If you didn’t request a password reset, you can safely ignore this message.
          </p>
        </div>

        <p style="margin-top: 20px; font-size: 15px; color: #444;">
          Best regards,<br>
          <strong>The Local Loop FL Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f7f7f7; padding: 20px; text-align: center; font-size: 13px; color: #666; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0;">© ${new Date().getFullYear()} <strong>The Local Loop FL</strong>. All rights reserved.</p>
        <p style="margin: 5px 0 0;">This is an automated message — please do not reply.</p>
      </div>
    </div>
  `;
}
