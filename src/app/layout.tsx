import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:{
    default: "The Local Loop FL | Local Events, Blogs & Spotlights",
    template: "%s | The Local Loop FL"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black" cz-shortcut-listen="true">
          <main className="w-full overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
