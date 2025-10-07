import { NextResponse } from "next/server";
import { advertiseFormTemplate } from "../../../../lib/advertiseFormTemplate";
import nodemailer from "nodemailer";

type VerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function POST(req: Request) {
  try {
    const { name, businessName, email, message, recaptchaToken } = await req.json();

    if (!name || !businessName || !email || !message || !recaptchaToken) {
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
      from: `"The Local Loop FL | Advertise" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Advertising Request from ${name}`,
      html: advertiseFormTemplate(name, businessName, email, message),
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (err: unknown) {
    console.error("Form submission error:", err);

    let message = "Something went wrong";
    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
