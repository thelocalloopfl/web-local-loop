import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";
import { contactFormTemplate } from "../../../../lib/contactFormTemplate";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, question, email, message } = await req.json();

    if (!name || !question || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to Sanity
    const doc = {
      _type: "contactFormSubmission",
      name,
      email,
      question,
      message,
      createdAt: new Date().toISOString(),
    };
    const result = await writeClient.create(doc);

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"The Local Loop FL | Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: contactFormTemplate(name, email, question, message),
    });


    return NextResponse.json({ success: true, id: result._id });
  } catch (err: unknown) {
    console.error("Sanity form submission error:", err);

    let message = "Something went wrong";
    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
