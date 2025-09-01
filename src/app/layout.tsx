import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import type { Metadata } from "next";
import { CartProvider } from "./components/Context/Context";

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
        <CartProvider>
          <Header />
          <main className="w-full px-[20px] py-4">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
