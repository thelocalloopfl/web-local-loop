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

      <div className="border-t border-[var(--footer-border)] mt-4 pt-4 pb-6 text-center">
        <span className="text-sm">&copy; 2025 The Local Loop FL. All Rights Reserved.</span>
      </div>
    </footer>
  );
}
