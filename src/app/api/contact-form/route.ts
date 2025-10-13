import { NextResponse } from "next/server";
import { contactFormTemplate } from "../../../../lib/contactFormTemplate";
import nodemailer from "nodemailer";

type VerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function POST(req: Request) {
  try {
    const { name, question, email, message, recaptchaToken } = await req.json();

    if (!name || !question || !email || !message || !recaptchaToken) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Verify reCAPTCHA token
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      throw new Error("Missing RECAPTCHA_SECRET_KEY");
    }

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", recaptchaToken);

    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: params,
    });

    const data = (await verifyRes.json()) as VerifyResponse;
    if (!data.success) {
      console.error("reCAPTCHA failed:", data);
      return NextResponse.json(
        { success: false, error: "Failed reCAPTCHA verification" },
        { status: 400 }
      );
    }

    // ✅ Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"The Local Loop FL | Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: contactFormTemplate(name, email, question, message),
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err: unknown) {
    console.error("Contact form error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
