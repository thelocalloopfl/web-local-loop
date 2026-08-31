import FooterClient from "./FooterClient";
import LogoServer from "./LogoServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Footer() {
  return (
    <footer className="main-footer bg-[var(--footer-bg)] text-[var(--footer-text)] pt-12 pb-0 mt-10 w-full transition-colors duration-500">
      <div className="main-footer-inner grid grid-cols-1 md:grid-cols-3 gap-10 pb-8 mx-auto px-2">
        {/* Column 1 */}
        <div>
          <LogoServer />
          <p className="text-base opacity-90 max-w-xs">
            Your guide to Winter Garden, Florida. Discover local events, businesses, and stories.
          </p>
        </div>

        <FooterClient />
      </div>

      <div className="border-t border-[var(--footer-border)] mt-4 pt-4 pb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
        <span className="text-sm">
          &copy; {new Date().getFullYear()} The Local Loop FL. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
