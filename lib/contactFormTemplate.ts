export function contactFormTemplate(
  name: string,
  email: string,
  question: string,
  message: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
      
      <!-- Header -->
      <div style="background: #FFF4E6; padding: 25px 20px; text-align: center; border-bottom: 3px solid #f97316;">
        <h2 style="color: #f97316; margin: 0; font-size: 24px;">New Contact Form Submission</h2>
        <p style="color: #555; margin-top: 5px; font-size: 14px;">A message has been submitted through your website.</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px; color: #333;">

        <!-- Submitter -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Sender Details</h3>
        <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;">
            <strong>Email:</strong>
            <a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a>
          </p>
        </div>

        <!-- Question Info -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Inquiry Details</h3>
        <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 5px 0;"><strong>Question:</strong> ${question}</p>
        </div>

        <!-- Message -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Message</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
          <p style="margin: 0; white-space: pre-wrap; color: #444;">${message}</p>
        </div>

        <!-- Submitted Time -->
        <p style="margin-top: 25px; font-size: 14px; color: #777;">
          Submitted on: ${new Date().toLocaleString()}
        </p>

        <!-- Action Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:${email}" 
             style="background-color: #f97316; color: #ffffff; padding: 14px 30px; 
                    text-decoration: none; border-radius: 6px; display: inline-block; 
                    font-weight: bold; font-size: 16px;">
            Reply to ${name}
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background: #f7f7f7; padding: 20px; text-align: center; font-size: 13px; color: #666; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0;">© ${new Date().getFullYear()} <strong>The Local Loop FL</strong>. All rights reserved.</p>
      </div>

    </div>
  `;
}
