import { ImageResponse } from "next/og";

export const alt = "The Local Loop FL — Winter Garden, Florida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #7c2d12 0%, #ea580c 55%, #f59e0b 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 4, opacity: 0.9 }}>
          THE LOCAL LOOP FL
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>
          Winter Garden events, local businesses &amp; community news
        </div>
        <div style={{ fontSize: 30, opacity: 0.9, marginTop: 28 }}>
          thelocalloopfl.com
        </div>
      </div>
    ),
    { ...size }
  );
}
