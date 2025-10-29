import LogoServer from "./LogoServer";
import HeaderClient from "./HeaderClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Header() {
  return (
    <header className="main-header py-4 shadow-md fixed top-0 left-0 right-0 z-50 bg-background text-foreground dark:bg-[#0a0a0a] border-b border-gray-700/40">
      <div className="main-header-inner flex items-center justify-between relative">
        {/* ✅ Server-rendered Logo */}
        <div className="flex items-center space-x-4">
          <LogoServer />
        </div>

        {/* ✅ Client-only interactive part */}
        <HeaderClient />
      </div>
    </header>
  );
}
