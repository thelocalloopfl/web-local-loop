// pages/api/revalidate.ts

import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Next.js API Route for Sanity Webhooks
 */
interface RevalidateRequestBody {
  _type?: string;
  _id?: string;
  slug?: {
    current?: string;
  };
}

interface JsonResponse {
  msg?: string;
  err?: string;
}

export default async function handler(
  req: NextApiRequest & { body: RevalidateRequestBody },
  res: NextApiResponse<JsonResponse>
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ msg: "Only POST requests allowed" });
    }

    const signature = req.headers[SIGNATURE_HEADER_NAME];

    if (!signature || typeof signature !== "string") {
      return res.status(400).json({ msg: "Missing or invalid signature" });
    }

    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(500).json({ msg: "Missing SANITY_WEBHOOK_SECRET environment variable" });
    }

    const isValid = isValidSignature(
      JSON.stringify(req.body),
      signature,
      webhookSecret
    );

    if (!isValid) {
      return res.status(401).json({ msg: "Invalid request!" });
    }

    const { _type, _id, slug } = req.body;

    if (!_type) {
      return res.status(400).json({ msg: "Missing _type in body" });
    }

    const pathsToRevalidate: string[] = [];

    // Handle revalidation logic by document type
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

    // Run revalidation
    for (const path of pathsToRevalidate) {
      try {
        await res.revalidate(path);
        console.log(`Revalidated: ${path}`);
      } catch (err) {
        console.error(`Failed to revalidate ${path}:`, err);
      }
    }

    return res.status(200).json({ msg: `Revalidated paths: ${pathsToRevalidate.join(", ")}` });
  } catch (error) {
    console.error("Revalidation error:", error);
    return res.status(500).json({ err: "Something went wrong!" });
  }
}
