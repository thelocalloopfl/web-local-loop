"use client";

import Image from "next/image";
import { urlFor } from "@/lib/sanity";

interface LogoData {
  logo?: {
    asset: { _ref: string; _type: "reference" };
    _type: "image";
  };
  alt?: string;
  title?: string;
}

interface LogoClientProps {
  logo: LogoData;
  width?: number;
  height?: number;
}

export default function LogoClient({
  logo,
  width = 120,
  height = 120,
}: LogoClientProps) {
  if (!logo?.logo) return null;

  return (
    <div className="site-logo">
      <Image
        src={urlFor(logo.logo).width(width).height(height).url()}
        width={width}
        height={height}
        alt={logo.alt || "Logo"}
        style={{ color: "transparent" }}
        priority
      />
    </div>
  );
}
