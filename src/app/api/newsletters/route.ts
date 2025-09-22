/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

interface Newsletter {
  title: string;
  link: string;
  date?: string;
  snippet?: string;
  image?: string;
}

export async function GET() {
  try {
    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;

    if (!BEEHIIV_API_KEY) {
      console.error("[DEBUG] Missing BEEHIIV_API_KEY in environment variables");
      return NextResponse.json(
        { error: "Beehiiv API key not configured" },
        { status: 500 }
      );
    }
    const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (!PUBLICATION_ID) {
      console.error("[DEBUG] Missing BEEHIIV_PUBLICATION_ID in environment variables");
      return NextResponse.json(
        { error: "Beehiiv Publication ID not configured" },
        { status: 500 }
      );
    }
  

    const requestUrl = `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/posts?limit=4&page=1`;

    console.log("[DEBUG] Fetching newsletters from:", requestUrl);

    const { data } = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${BEEHIIV_API_KEY}`,
      },
    });

    console.log("[DEBUG] Raw API response:", JSON.stringify(data, null, 2));

    const newsletters: Newsletter[] = data.data.map((post: any, index: number) => {
      const mapped = {
        title: post.title,
        link: post.web_url,
        date: post.publish_date ? new Date(post.publish_date * 1000).toISOString() : undefined, // convert from unix timestamp
        snippet: post.subtitle,
        image: post.thumbnail_url || undefined,
      };
      console.log(`[DEBUG] Mapped newsletter ${index + 1}:`, mapped);
      return mapped;
    });

    console.log("[DEBUG] Final newsletters array:", newsletters);

    return NextResponse.json(newsletters);
  } catch (err: any) {
    console.error("[DEBUG] Error fetching newsletters");
    if (err.response) {
      console.error("[DEBUG] Error Response Status:", err.response.status);
      console.error("[DEBUG] Error Response Data:", err.response.data);
    } else {
      console.error("[DEBUG] Error Message:", err.message);
    }

    return NextResponse.json(
      { error: "Failed to fetch newsletters from Beehiiv API" },
      { status: 500 }
    );
  }
}
