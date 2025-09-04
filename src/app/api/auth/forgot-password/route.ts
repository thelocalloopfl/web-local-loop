import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { writeClient } from "../../../../lib/sanity";
import { passwordResetTemplate } from "../../../../../lib/emailTemplates";

const TOKEN_EXPIRY = 1000 * 60 * 15; // 15 minutes

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // 🔍 Find user in Sanity
    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // 🔑 Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + TOKEN_EXPIRY;

    // 🔗 Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;

    // 📧 Setup transporter using SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 📩 Send reset email
    await transporter.sendMail({
      from: `"The Local Loop FL" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request - The Local Loop FL",
      html: passwordResetTemplate(user.name, resetLink),
    });

    // 🍪 Store token + email in cookies
    const response = NextResponse.json(
      { success: true, message: "Password reset email sent" },
      { status: 200 }
    );

    response.cookies.set("resetToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(expiresAt),
      path: "/",
    });

    response.cookies.set("resetEmail", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(expiresAt),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
