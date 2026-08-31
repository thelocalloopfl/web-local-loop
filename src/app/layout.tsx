import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import Analytics from "./components/Analytics";
import { ThemeProvider } from "./components/theme-provider";

// ✅ Google Analytics ID from env
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// ✅ Fonts with CSS variables
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-playfair",
});

// ✅ Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://thelocalloopfl.com"),
  title: {
    default: "The Local Loop FL | Winter Garden Events, Local Businesses & Community News",
    template: "%s | The Local Loop FL",
  },
  description:
    "Your guide to Winter Garden and West Orange County, Florida. Discover local events, a trusted business directory, community stories, and our newsletter.",
  applicationName: "The Local Loop FL",
  keywords: [
    "Winter Garden",
    "West Orange County",
    "Winter Garden events",
    "Winter Garden businesses",
    "local news Winter Garden",
    "The Local Loop FL",
  ],
  openGraph: {
    type: "website",
    siteName: "The Local Loop FL",
    locale: "en_US",
    url: "https://thelocalloopfl.com",
    title: "The Local Loop FL | Winter Garden Events, Local Businesses & Community News",
    description:
      "Your guide to Winter Garden and West Orange County, Florida — local events, a business directory, community stories, and our newsletter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Local Loop FL",
    description:
      "Your guide to Winter Garden and West Orange County, Florida — events, local businesses, and community news.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Preconnect to Google Fonts (performance) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ✅ Organization + WebSite structured data */}
        <Script id="ld-json-org" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://thelocalloopfl.com/#organization",
                name: "The Local Loop FL",
                url: "https://thelocalloopfl.com",
                description:
                  "A hyperlocal community platform for Winter Garden and West Orange County, Florida.",
                areaServed: {
                  "@type": "City",
                  name: "Winter Garden",
                  containedInPlace: { "@type": "State", name: "Florida" },
                },
                email: "hello@thelocalloopfl.com",
              },
              {
                "@type": "WebSite",
                "@id": "https://thelocalloopfl.com/#website",
                url: "https://thelocalloopfl.com",
                name: "The Local Loop FL",
                publisher: { "@id": "https://thelocalloopfl.com/#organization" },
              },
            ],
          })}
        </Script>

        {/* ✅ Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>

      <body
        className={`bg-white text-black dark:bg-black dark:text-white ${inter.variable} ${playfair.variable}`}
        cz-shortcut-listen="true"
      >
        {/* ✅ Wrap everything in ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="w-full">{children}</main>

          {/* ✅ Wrap Analytics in Suspense */}
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
