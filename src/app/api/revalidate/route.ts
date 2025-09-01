import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "❌ Server error: SANITY_WEBHOOK_SECRET missing" },
      { status: 500 }
    );
  }

  // Raw body is needed for signature validation
  const bodyText = await req.text();

  // Example header: "t=1756733179073,v1=0Kp_xxqxZJW6SSjoz3WbrURxSSIM0lVGcJt69SEJEuE"
  const sigHeader = req.headers.get("sanity-webhook-signature") || "";
  const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));

  const timestamp = parts.t;
  const receivedSig = parts.v1;

  if (!timestamp || !receivedSig) {
    return NextResponse.json(
      { message: "❌ Missing signature header parts" },
      { status: 401 }
    );
  }

  // Build signing input: "<timestamp>.<body>"
  const signingInput = `${timestamp}.${bodyText}`;

  // Compute HMAC (digest in base64 to match v1)
  const computedSig = createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64");

  // Compare securely
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

   // Parse the body after verification
  interface WebhookBody {
    _type: string;
    slug?: { current?: string };
    _id?: string;
    [key: string]: unknown;
  }
  let body: WebhookBody;

  try {
    body = JSON.parse(bodyText);
    const { _type, slug, _id } = body;
    const pathsToRevalidate: string[] = [];

    switch (_type) {
      case 'blog':
        if (_id) pathsToRevalidate.push(`/blog/${_id}`);
        pathsToRevalidate.push('/blog', '/');
        break;

      case 'blogCategory':
        pathsToRevalidate.push('/blog', '/');
        break;

      case 'bannerSection':
        pathsToRevalidate.push('/');
        break;

      case 'event':
        if (slug?.current) pathsToRevalidate.push(`/event/${slug.current}`);
        pathsToRevalidate.push('/events', '/');
        break;

      case 'eventCategory':
        pathsToRevalidate.push('/events', '/');
        break;

      case 'directory':
      case 'directoryCategory':
        pathsToRevalidate.push('/directory');
        break;

      case 'siteLogo':
      case 'middleBanner':
      case 'sidebar':
      case 'topBanner':
        pathsToRevalidate.push(
          '/', '/newsletter', '/blog', '/local-spotlight', '/shop',
          '/advertise', '/about', '/contact', '/directory'
        );
        break;

      case 'shop':
        pathsToRevalidate.push('/shop');
        break;

      case 'spotlight':
        pathsToRevalidate.push('/local-spotlight', '/');
        break;

      case 'spotlightCategory':
        pathsToRevalidate.push('/local-spotlight', '/');
        break;

      default:
        console.warn(`⚠️ Unknown content type: ${_type}`);
        break;
    }

    // Trigger revalidation
    await Promise.all(
      pathsToRevalidate.map(async (path) => {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/revalidate?path=${encodeURIComponent(
              path
            )}&secret=${secret}`
          );
        } catch (err) {
          console.error(`Failed to revalidate ${path}`, err);
        }
      })
    );

    return NextResponse.json({
      message: '✅ Revalidation triggered',
      paths: pathsToRevalidate,
    });
  } catch (error) {
    console.error('❌ Revalidation failed:', error);
    return NextResponse.json({ message: 'Revalidation failed' }, { status: 500 });
  }
}
