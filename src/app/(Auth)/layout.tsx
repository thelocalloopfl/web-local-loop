import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../components/Context/Context";
import Providers from "../providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
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
