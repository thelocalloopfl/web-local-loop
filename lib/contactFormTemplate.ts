export function contactFormTemplate(
  name: string,
  email: string,
  question: string,
  message: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #FFF4E6; padding: 20px; text-align: center; border-bottom: 3px solid #f97316;">
        <h2 style="color: #f97316; margin: 0;">The Local Loop FL | Contact</h2>
      </div>
      
      <div style="padding: 30px; background: #ffffff; font-size: 16px;">
        <h3 style="color: #333; margin-top: 0;">New Contact Form Submission</h3>
        
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Question:</strong> ${question}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="background: #FFF4E6; padding: 20px; text-align: center; 
                  font-size: 12px; color: #666; border-top: 1px solid #ddd;">
        <p>© ${new Date().getFullYear()} The Local Loop FL. All rights reserved.</p>
      </div>
    </div>
  `;
}
