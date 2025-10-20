export function eventSubmissionTemplate(
  name: string,
  email: string,
  eventTitle: string,
  eventDate: string,
  eventDetails: string,
  category: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
      
      <!-- Header -->
      <div style="background: #FFF4E6; padding: 25px 20px; text-align: center; border-bottom: 3px solid #f97316;">
        <h2 style="color: #f97316; margin: 0; font-size: 24px;">🎉 New Event Submission</h2>
        <p style="color: #555; margin-top: 5px; font-size: 14px;">A new event has been submitted through your website.</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px; color: #333;">
        
        <!-- Submitter -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Submitter Details</h3>
        <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;">
            <strong>Email:</strong> 
            <a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a>
          </p>
        </div>

        <!-- Event Info -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Event Information</h3>
        <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 5px 0;"><strong>Title:</strong> ${eventTitle}</p>
          <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${eventDate}</p>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${category}</p>
        </div>

        <!-- Description -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Event Description</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
          <p style="margin: 0; white-space: pre-wrap; color: #444;">${eventDetails}</p>
        </div>

        <!-- Submitted Time -->
        <p style="margin-top: 25px; font-size: 14px; color: #777;">
          Submitted on: ${new Date().toLocaleString()}
        </p>

        <!-- Image Note -->
        <p style="margin-top: 25px; font-size: 14px; color: #777; font-style: italic;">
          📎 An event image may be attached to this email if one was provided.
        </p>

      </div>

      <!-- Footer -->
      <div style="background: #f7f7f7; padding: 20px; text-align: center; font-size: 13px; color: #666; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0;">© ${new Date().getFullYear()} <strong>The Local Loop FL</strong>. All rights reserved.</p>
      </div>

    </div>
  `;
}
