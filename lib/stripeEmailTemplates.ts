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
      (item) =>
        `<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.qty}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${currency} ${item.price.toFixed(
          2
        )}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #FFF4E6; padding: 20px; text-align: center; border-bottom: 3px solid #f97316;">
        <h2 style="color: #f97316; margin: 0;">The Local Loop FL | Invoice</h2>
      </div>

      <div style="padding: 30px; background: #ffffff; font-size: 16px;">
        <h3 style="color: #333; margin-top: 0;">Payment Receipt</h3>
        
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <thead>
            <tr style="background: #f97316; color: #fff;">
              <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
            <tr>
              <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Total</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>${currency} ${totalAmount.toFixed(
                2
              )}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="background: #FFF4E6; padding: 20px; text-align: center; 
                  font-size: 12px; color: #666; border-top: 1px solid #ddd;">
        <p>© ${new Date().getFullYear()} The Local Loop FL. All rights reserved.</p>
      </div>
    </div>
  `;
}
