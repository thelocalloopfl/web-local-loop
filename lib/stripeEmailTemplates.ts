export function invoiceEmailTemplate(
  customerName: string,
  email: string,
  orderId: string,
  items: { name: string; qty: number; price: number }[],
  totalAmount: number,
  currency: string
) {
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #ddd; text-align: left;">${item.name}</td>
          <td style="padding: 10px 12px; border: 1px solid #ddd; text-align: center;">${item.qty}</td>
          <td style="padding: 10px 12px; border: 1px solid #ddd; text-align: right;">${currency} ${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 20px auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden; background-color: #ffffff;">

      <!-- Header -->
      <div style="background: #FFF4E6; padding: 25px 20px; text-align: center; border-bottom: 3px solid #f97316;">
        <h2 style="color: #f97316; margin: 0; font-size: 24px;">🧾 Payment Invoice</h2>
        <p style="color: #555; margin-top: 5px; font-size: 14px;">Thank you for your payment with <strong>The Local Loop FL</strong>.</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px; color: #333;">

        <!-- Customer Info -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Customer Details</h3>
        <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
          <p style="margin: 5px 0;">
            <strong>Email:</strong> 
            <a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a>
          </p>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <!-- Invoice Table -->
        <h3 style="color: #f97316; margin-bottom: 8px;">Order Summary</h3>
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px; font-size: 15px;">
          <thead>
            <tr style="background: #f97316; color: #ffffff;">
              <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: left;">Item</th>
              <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: center;">Quantity</th>
              <th style="padding: 10px 12px; border: 1px solid #ddd; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
            <tr style="background-color: #fafafa;">
              <td colspan="2" style="padding: 10px 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total</td>
              <td style="padding: 10px 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #f97316;">
                ${currency} ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Footer Note -->
        <p style="margin-top: 25px; font-size: 14px; color: #777; font-style: italic;">
          💡 If you have any questions about this invoice, please contact us at 
          <a href="mailto:support@thelocalloopfl.com" style="color: #f97316; text-decoration: none;">support@thelocalloopfl.com</a>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f7f7f7; padding: 20px; text-align: center; font-size: 13px; color: #666; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0;">© ${new Date().getFullYear()} <strong>The Local Loop FL</strong>. All rights reserved.</p>
      </div>
    </div>
  `;
}
