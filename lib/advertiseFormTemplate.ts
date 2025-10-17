export function advertiseFormTemplate(
  name: string,
  businessName: string,
  email: string,
  phone: string,
  message: string,
  adZone?: string,
  hasAttachment?: boolean
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
      
      <!-- Header -->
      <div style="background: #FFF4E6; padding: 25px 20px; text-align: center; border-bottom: 3px solid #f97316;">
        <h2 style="color: #f97316; margin: 0; font-size: 24px;">📢 New Advertising Request</h2>
        <p style="color: #555; margin-top: 5px; font-size: 14px;">
          A new advertising inquiry has been submitted via your website.
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 30px; color: #333;">
        
        <!-- Submitter Info -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Advertiser Details</h3>
        <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Business Name:</strong> ${businessName}</p>
          <p style="margin: 5px 0;">
            <strong>Email:</strong>
            <a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a>
          </p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
          ${
            adZone
              ? `<p style="margin: 5px 0;"><strong>Ad Zone:</strong> ${adZone}</p>`
              : ""
          }
        </div>

        <!-- Message -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Advertisement Message</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
          <p style="margin: 0; white-space: pre-wrap; color: #444;">${message}</p>
        </div>

        <!-- Submitted Time -->
        <p style="margin-top: 25px; font-size: 14px; color: #777;">
          Submitted on: ${new Date().toLocaleString()}
        </p>

        ${
          hasAttachment
            ? `
          <!-- Ad Attachment Note -->
          <p style="margin-top: 25px; font-size: 14px; color: #777; font-style: italic;">
            📎 An advertisement image or PDF file was attached to this email.
          </p>
          `
            : ""
        }

      </div>

      <!-- Footer -->
      <div style="background: #f7f7f7; padding: 20px; text-align: center; font-size: 13px; color: #666; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0;">© ${new Date().getFullYear()} <strong>The Local Loop FL</strong>. All rights reserved.</p>
      </div>

    </div>
  `;
}
