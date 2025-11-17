"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./Context/Context";
import ThemeToggle from "./theme-toggle";

export default function HeaderClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();
  const { data: session } = useSession();

  useEffect(() => setIsClient(true), []);

  // ✅ Menu logic
  const menuItems = [
    { name: "Home", href: "/home" },
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/event" },
    { name: "Local Spotlight", href: "/local-spotlight" },
    { name: "Advertise", href: "/advertise" },
    { name: "Directory", href: "/directory", icon: false },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Shop", href: "/shop" },
    { name: "Pricing", href: "/pricing", },
    { name: "", href: "/cart", icon: true },

  ];

  // const privateMenu = [
  //   // { name: "Newsletter", href: "/newsletter" },
  //   // { name: "Shop", href: "/shop" },
  //   // { name: "", href: "/cart", icon: true },
  // ];

  const linkClass = (active: boolean) =>
    `px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
      active
        ? "bg-orange-600 text-white font-bold"
        : "text-white hover:bg-orange-400 hover:text-white"
    }`;

  return (
    <>
      {/* 💻 Desktop Menu */}
      <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
        {/* {[...menuItems, ...(session ? privateMenu : [])].map((item) => { */}
        {[...menuItems].map((item) => {

          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={linkClass(isActive)}>
              {item.icon && (
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                    />
                    <circle cx="7" cy="21" r="1" />
                    <circle cx="17" cy="21" r="1" />
                  </svg>
                  {isClient && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
              )}
              {item.name}
            </Link>
          );
        })}

        {/* 🧭 Auth Button */}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 text-white bg-orange-600 hover:bg-orange-500 transition rounded-3xl font-bold shadow"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">
            <button className="px-4 py-2 text-white bg-orange-600 hover:bg-orange-500 transition rounded-3xl font-bold shadow">
              Login
            </button>
          </Link>
        )}
        <ThemeToggle />
      </nav>

      {/* 📱 Mobile Hamburger */}
      <button
        className="lg:hidden flex items-center px-2 py-1 text-white focus:outline-none"
        onClick={() => setMobileMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          // Cross Icon
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger Icon
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* 📱 Mobile Menu Drawer */}
      <div

        className={`lg:hidden fixed top-[102px] right-0 w-80 bg-[#20293a] text-white shadow-lg border-l border-gray-700 transition-transform duration-500 transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >

        <nav className="flex flex-col gap-3 p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
        <div className="flex justify-end">
            <ThemeToggle />
        </div>
          {[...menuItems].map((item) => {
          // {[...menuItems, ...(session ? privateMenu : [])].map((item) => {

            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={linkClass(isActive)}
              >
                {item.icon && (
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                      />
                      <circle cx="7" cy="21" r="1" />
                      <circle cx="17" cy="21" r="1" />
                    </svg>
                    {isClient && cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </div>
                )}
                {item.name}
              </Link>
            );
          })}

          {/* Auth Buttons */}
          {session ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="mt-4 px-6 py-2 w-full text-white bg-orange-600 hover:bg-orange-500 transition rounded-3xl font-extrabold shadow"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="mt-4 px-6 py-2 w-full text-white bg-orange-600 hover:bg-orange-500 transition rounded-3xl font-extrabold shadow">
                Login
              </button>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
