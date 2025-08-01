import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Local Loop',
  description: 'Sanity-powered Next.js site',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Header />
        <main className="w-full px-[20px] py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
