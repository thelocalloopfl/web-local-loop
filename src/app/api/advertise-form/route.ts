/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { advertiseFormTemplate } from "../../../../lib/advertiseFormTemplate";

export const runtime = "nodejs"; // ✅ Required for file buffers in edge builds

export async function POST(req: Request) {
  try {
    // ✅ Parse multipart form data manually
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const businessName = formData.get("businessName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const adZone = formData.get("adZone") as string | null;
    const recaptchaToken = formData.get("recaptchaToken") as string;
    const file = formData.get("file") as File | null;

    if (!name || !businessName || !email || !message || !phone) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Verify reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY!;
    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: recaptchaToken }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json(
        { success: false, error: "Failed reCAPTCHA verification" },
        { status: 400 }
      );
    }

    // ✅ Nodemailer setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Prepare attachment (if uploaded)
    const attachments = [];
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // ✅ Send admin email
    await transporter.sendMail({
      from: `"The Local Loop FL | Advertise" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Advertising Request from ${name}`,
      html: advertiseFormTemplate(name, businessName, email, phone, message, adZone || undefined,   !!file),
      attachments,
    });

    // ✅ Auto reply to user
    await transporter.sendMail({
      from: `"The Local Loop FL" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thanks for contacting The Local Loop FL!",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:20px; border-radius:8px;">
          <h2 style="color:#f97316;">Thank you, ${name}!</h2>
          <p>We’ve received your advertising inquiry and will respond within <strong>24 hours</strong>.</p>
          <p>Meanwhile, feel free to explore our site for upcoming events and promotions.</p>
          <p style="margin-top:20px;">— <strong>The Local Loop FL Team</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Advertise form error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
