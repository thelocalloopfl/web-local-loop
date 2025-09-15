// api/auth/reset-password
import { NextResponse } from "next/server";
import { writeClient } from "../../../../lib/sanity";
import bcrypt from "bcrypt";


export async function POST(req: Request) {
  try {
    const { password, token: reqToken } = await req.json();

    if (!password || !reqToken) {
      return NextResponse.json(
        { success: false, message: "Password and token are required" },
        { status: 400 }
      );
    }

    // 🔍 Get cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [key, ...v] = c.trim().split("=");
        return [key, decodeURIComponent(v.join("="))];
      })
    );

    const cookieToken = cookies["resetToken"];
    const email = cookies["resetEmail"];

    if (!cookieToken || !email) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset link" },
        { status: 401 }
      );
    }

    // 🔑 Match tokens
    if (cookieToken !== reqToken) {
      return NextResponse.json(
        { success: false, message: "Token mismatch or expired" },
        { status: 403 }
      );
    }

    // 🔐 Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✏️ Fetch user by email
    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Update password in Sanity
    await writeClient
      .patch(user._id)
      .set({ password: hashedPassword })
      .commit();

    // 🧹 Clear cookies after success
    const response = NextResponse.json(
      { success: true, message: "Password has been reset successfully" },
      { status: 200 }
    );

    response.cookies.set("resetToken", "", {
      expires: new Date(0),
      path: "/",
    });
    response.cookies.set("resetEmail", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
