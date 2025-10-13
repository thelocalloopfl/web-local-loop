import LogoServer from "../components/LogoServer";
import HeaderClient from "../components/HeaderClient";
export const dynamic = "force-dynamic"; 
export const revalidate = 0;

export default async function Header() {
  return (
    <header className="main-header py-4 shadow-md fixed top-0 left-0 right-0 z-50 bg-[#20293a]">
      <div className="main-header-inner flex items-center justify-between relative">
        <div className="flex items-center space-x-4">
          <LogoServer />
        </div>

        {/* Client-only part */}
        <HeaderClient />
      </div>
    </header>
  );
}
