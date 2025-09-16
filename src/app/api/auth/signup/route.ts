import { NextResponse } from "next/server";
import { writeClient } from "../../../../lib/sanity";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !phone || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const existingUser = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Sanity
    await writeClient.create({
      _type: "user",
      name,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
