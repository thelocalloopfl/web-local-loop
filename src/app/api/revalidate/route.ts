// src/app/api/revalidate/route.ts

import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
import { NextRequest, NextResponse } from "next/server";

// Extend globalThis to include revalidatePath
declare global {
  // eslint-disable-next-line no-var
  var revalidatePath: ((path: string) => Promise<void>) | undefined;
}

interface RevalidateRequestBody {
  _type?: string;
  _id?: string;
  slug?: {
    current?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: RevalidateRequestBody = await req.json();

    const signature = req.headers.get(SIGNATURE_HEADER_NAME);
    if (!signature) {
      return NextResponse.json({ msg: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { msg: "Missing SANITY_WEBHOOK_SECRET environment variable" },
        { status: 500 }
      );
    }

    const isValid = isValidSignature(
      JSON.stringify(body),
      signature,
      webhookSecret
    );

    if (!isValid) {
      return NextResponse.json({ msg: "Invalid request!" }, { status: 401 });
    }

    const { _type, _id, slug } = body;
    if (!_type) {
      return NextResponse.json({ msg: "Missing _type in body" }, { status: 400 });
    }

    const pathsToRevalidate: string[] = [];

    switch (_type) {
      case "blog":
        if (_id) pathsToRevalidate.push(`/blog/${_id}`);
        pathsToRevalidate.push("/blog", "/");
        break;

      case "blogCategory":
        pathsToRevalidate.push("/blog", "/");
        break;

      case "bannerSection":
        pathsToRevalidate.push("/");
        break;

      case "event":
        if (slug?.current) pathsToRevalidate.push(`/event/${slug.current}`);
        pathsToRevalidate.push("/events", "/");
        break;

      case "eventCategory":
        pathsToRevalidate.push("/events", "/");
        break;

      case "directory":
      case "directoryCategory":
        pathsToRevalidate.push("/directory");
        break;

      case "siteLogo":
      case "middleBanner":
      case "sidebar":
      case "topBanner":
        pathsToRevalidate.push(
          "/",
          "/newsletter",
          "/blog",
          "/local-spotlight",
          "/shop",
          "/advertise",
          "/about",
          "/contact",
          "/directory"
        );
        break;

      case "shop":
        pathsToRevalidate.push("/shop");
        break;

      case "spotlight":
      case "spotlightCategory":
        pathsToRevalidate.push("/local-spotlight", "/");
        break;

      default:
        console.log(`No revalidation rule for type: ${_type}`);
        break;
    }

    // Revalidate each path
    for (const path of pathsToRevalidate) {
      try {
        // Use Next.js revalidatePath API
        if (typeof globalThis.revalidatePath === "function") {
          await globalThis.revalidatePath(path);
          console.log(`Revalidated: ${path}`);
        } else {
          console.warn("revalidatePath is not available in this context.");
        }
      } catch (err) {
        console.error(`Failed to revalidate ${path}:`, err);
      }
    }

    return NextResponse.json(
      { msg: `Revalidated paths: ${pathsToRevalidate.join(", ")}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ err: "Something went wrong!" }, { status: 500 });
  }
}
