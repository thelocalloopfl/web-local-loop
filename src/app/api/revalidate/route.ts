import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";

// Normalize base64url → base64
function normalizeBase64Url(sig: string): string {
  return sig
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(sig.length + (4 - (sig.length % 4)) % 4, "=");
}

// Revalidate + warmup cache
async function revalidateAndWarmup(path: string) {
  revalidatePath(path);
  console.log(`🔄 Revalidated: ${path}`);

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    console.warn("⚠️ NEXT_PUBLIC_SITE_URL not set, skipping warmup fetch");
    return;
  }

  try {
    // Warm up ISR cache by fetching the page
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}${path}`, {
      method: "GET",
      headers: { "User-Agent": "sanity-webhook-revalidator" },
    });
    console.log(`⚡ Warmed up: ${path}`);
  } catch (err) {
    console.error(`❌ Failed to warm up ${path}`, err);
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "❌ Server error: SANITY_WEBHOOK_SECRET missing" },
      { status: 500 }
    );
  }

  // Raw body for signature validation
  const bodyText = await req.text();
  const sigHeader = req.headers.get("sanity-webhook-signature") || "";

  let timestamp: string | undefined;
  let receivedSigRaw: string | undefined;

  if (sigHeader.includes("v1=")) {
    // Format: "t=...,v1=..."
    const parts = Object.fromEntries(
      sigHeader.split(",").map((p) => p.split("="))
    );
    timestamp = parts.t;
    receivedSigRaw = parts.v1;
  } else {
    receivedSigRaw = sigHeader;
  }

  if (!receivedSigRaw) {
    return NextResponse.json(
      { message: "❌ Missing signature" },
      { status: 401 }
    );
  }

  const receivedSig = normalizeBase64Url(receivedSigRaw);
  const signingInput = timestamp ? `${timestamp}.${bodyText}` : bodyText;

  const computedSig = createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64");

  const valid =
    receivedSig.length === computedSig.length &&
    timingSafeEqual(Buffer.from(receivedSig), Buffer.from(computedSig));

  if (!valid) {
    console.error("❌ Invalid signature");
    console.error("Received:", receivedSig);
    console.error("Expected:", computedSig);
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  console.log("✅ Signature verified");

  // --- Parse the body after verification ---
  interface WebhookBody {
    _type: string;
    slug?: { current?: string };
    _id?: string;
    [key: string]: unknown;
  }

  try {
    const body: WebhookBody = JSON.parse(bodyText);
    const { _type, slug, _id } = body;
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
        console.warn(`⚠️ Unknown content type: ${_type}`);
        break;
    }

    // Trigger ISR revalidation + warmup
    await Promise.all(pathsToRevalidate.map(revalidateAndWarmup));

    return NextResponse.json({
      message: "✅ Revalidation triggered",
      paths: pathsToRevalidate,
    });
  } catch (error) {
    console.error("❌ Revalidation failed:", error);
    return NextResponse.json(
      { message: "Revalidation failed" },
      { status: 500 }
    );
  }
}
