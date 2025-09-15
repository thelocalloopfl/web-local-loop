import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../components/Context/Context";
import Providers from "../providers";
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

  console.log("RootLayout session:", session);
  return (
        <CartProvider>
          <Providers  >
            <Header />
              <main className="w-full px-[20px] py-4 mt-25 ">{children}</main>
            <Footer />
          </Providers>
        </CartProvider>
  );
}
