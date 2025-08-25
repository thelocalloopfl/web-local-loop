import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

interface Newsletter {
  title: string;
  link: string;
  date?: string;
  snippet?: string;
  image?: string;
}

export async function GET() {
  try {
    const BEEHIIV_URL = process.env.BEEHIIV_URL;
    if (!BEEHIIV_URL) {
      console.error("❌ BEEHIIV_URL not configured");
      return NextResponse.json(
        { error: "BEEHIIV_URL not configured in env" },
        { status: 500 }
      );
    }

    const baseURL = new URL(BEEHIIV_URL).origin;
    const { data } = await axios.get(BEEHIIV_URL);
    const $ = cheerio.load(data);

    const seen = new Map<string, Newsletter>();

    $('a[href^="/p/"]').each((i, el) => {
      const anchor = $(el);
      const card = anchor.closest("div.space-y-2, div.rounded-lg, div[class*='space-y']");

      const link = anchor.attr("href") || "";
      const fullLink = link.startsWith("http") ? link : `${baseURL}${link}`;

      const title = card.find("h2").text().trim();
      const snippet = card.find("p").text().trim();
      const date = card.find("time").text().trim();
      const image = card.find("img").attr("src");

      const isDefaultImage = image?.includes("profile_picture.png");

      console.log(`🧩 [${i}] Extracted Data:\n`, {
        title,
        link: fullLink,
        date,
        snippet,
        image,
      });

      if (title && link) {
        const existing = seen.get(fullLink);
        if (!existing || (existing.image?.includes("profile_picture.png") && !isDefaultImage)) {
          seen.set(fullLink, {
            title,
            link: fullLink,
            date: date || undefined,
            snippet: snippet || undefined,
            image: image || undefined,
          });
        }
      }
    });

    const newsletters = Array.from(seen.values());
    console.log("✅ Total newsletters scraped:", newsletters.length);

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("❌ Error scraping Beehiiv archive:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletters" },
      { status: 500 }
    );
  }
}
