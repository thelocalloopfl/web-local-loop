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
      return NextResponse.json(
        { error: "BEEHIIV_URL not configured in env" },
        { status: 500 }
      );
    }

    const { data } = await axios.get(BEEHIIV_URL);
    const $ = cheerio.load(data);
    const newsletters: Newsletter[] = [];

    $('a[href^="/p/"]').each((_, element) => {
      const link = $(element).attr("href") || "";
      const title =
        $(element).find("h2, h3").text().trim() ||
        $(element).text().trim();

      const snippet =
        $(element).find("p").text().trim() ||
        $(element).parent().find("p").first().text().trim();

      const image =
        $(element).find("img").attr("src") ||
        $(element).parent().find("img").attr("src");

      const date =
        $(element).find("time").text().trim() ||
        $(element).parent().find("time").text().trim();

      if (title && link) {
        newsletters.push({
          title,
          link: link.startsWith("http") ? link : `${BEEHIIV_URL}${link}`,
          date: date || undefined,
          snippet: snippet || undefined,
          image: image || undefined,
        });
      }
    });

    return NextResponse.json(newsletters);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch newsletters" },
      { status: 500 }
    );
  }
}
