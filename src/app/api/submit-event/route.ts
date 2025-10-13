/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { eventSubmissionTemplate } from "../../../../lib/eventSubmissionTemplate";

type VerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const eventTitle = formData.get("eventTitle") as string;
    const eventDate = formData.get("eventDate") as string;
    const eventDetails = formData.get("eventDetails") as string;
    const recaptchaToken = formData.get("recaptchaToken") as string;
    const imageFile = formData.get("image") as File | null;
    const category = formData.get("category") as string;

    // 🧩 Validate required fields
    if (
      !name ||
      !email ||
      !eventTitle ||
      !eventDate ||
      !eventDetails ||
      !recaptchaToken ||
      !category
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Verify reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) throw new Error("Missing RECAPTCHA_SECRET_KEY");

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", recaptchaToken);

    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: params,
      }
    );

    const data = (await verifyRes.json()) as VerifyResponse;

    if (!data.success) {
      console.error("reCAPTCHA failed:", data);
      return NextResponse.json(
        { success: false, error: "Failed reCAPTCHA verification" },
        { status: 400 }
      );
    }

    // 🖼️ Handle image attachment (if any)
    const attachments: any[] = [];
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      attachments.push({
        filename: imageFile.name,
        content: buffer,
        contentType: imageFile.type,
      });
    }

    // ✉️ Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 📬 Send email
    await transporter.sendMail({
      from: `"Event Submissions" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Event Submission: ${eventTitle}`,
      html: eventSubmissionTemplate(
        name,
        email,
        eventTitle,
        eventDate,
        eventDetails,
        category
      ),
      attachments,
    });

    return NextResponse.json(
      { success: true, message: "Event submitted successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Event submission error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
