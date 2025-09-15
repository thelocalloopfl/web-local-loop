"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../components/Context/Context";
export const dynamic = "force-dynamic"; 
export const revalidate = 0;

export default function HeaderClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();
  const { data: session } = useSession({
    required: false,
  });

  useEffect(() => setIsClient(true), [] );
  console.log('session are ' + session);

  const menuItems = [
    { name: "Home", href: "/home" },
    { name: "Blog", href: "/blog" },
    { name: "Local Spotlight", href: "/local-spotlight" },
    { name: "Advertise", href: "/advertise" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Directory", href: "/directory", icon: false },
  ];

  const privateMenu = [
    { name: "Newsletter", href: "/newsletter" },
    { name: "Shop", href: "/shop" },
    { name: "", href: "/cart", icon: true },
  ]

  return (
    <>
      {/* Desktop Menu */}
      <nav className="hidden lg:flex space-x-4 text-sm font-medium">
        {menuItems.map((item) => {
          const isActive =
            (item.href === "/" && pathname === "/") ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1" +
                (isActive
                  ? " bg-orange-700 text-white font-bold"
                  : " text-white hover:bg-orange-400 hover:text-white")
              }
            >
              {item?.icon && (
                <div className="relative">
                  {/* Cart Icon */}
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
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </div>
              )}
              {item.name}
            </Link>
          );
        })}
        {/* Show private menu only if user logged in */}
        {session &&
          privateMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}

              className={
                "px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1" +
                (pathname.startsWith(item.href)
                  ? " bg-orange-700 text-white font-bold"
                  : " text-white hover:bg-orange-400 hover:text-white")
              }
            >
              {item?.icon && (
                <div className="relative">
                  {/* Cart Icon */}
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
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </div>
              )}
              {item.name}
            </Link>
          ))}


        {/* ✅ Login / Logout Button */}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-6 py-2 text-white bg-orange-600 hover:bg-orange-500 cursor-pointer transition-all duration-300 rounded-3xl text-[16px] font-extrabold shadow"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">
            <button className="px-6 py-2 text-white bg-orange-700 hover:bg-orange-500 cursor-pointer transition-all duration-300 rounded-3xl text-[16px] font-extrabold shadow">
              Login
            </button>
          </Link>
        )}
      </nav>

      {/* Mobile Hamburger */}
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
            xmlns="http://www.w3.org/2000/svg"
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
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden absolute right-0 top-21.5 w-80 bg-[#20293a] text-white shadow-lg border-l border-gray-700 z-50 transform transition-transform duration-500 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <nav className="flex flex-col gap-2 p-6">
          {menuItems.map((item) => {
            const isActive =
              (item.href === "/" && pathname === "/") ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "py-2 px-3 rounded-md transition-colors duration-200 flex items-center gap-2" +
                  (isActive
                    ? " bg-orange-700 text-white font-bold"
                    : " text-white hover:bg-orange-400 hover:text-white")
                }
                onClick={() => setMobileMenuOpen(false)}
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
                      <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </div>
                )}
                {item.name}
              </Link>
            );
          })}

          {/* Show private menu only if user logged in */}
          {session &&
            privateMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}

                className={
                  "px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1" +
                  (pathname.startsWith(item.href)
                    ? " bg-orange-700 text-white font-bold"
                    : " text-white hover:bg-orange-400 hover:text-white")
                }
              >
                {item?.icon && (
                  <div className="relative">
                    {/* Cart Icon */}
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
                      <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </div>
                )}
                {item.name}
              </Link>
            ))}

          {session ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="px-6 py-2 w-full mt-5 text-white bg-orange-600 hover:bg-orange-500 cursor-pointer transition-all duration-300 rounded-3xl text-[16px] font-extrabold shadow"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="px-6 py-2 w-full font-extrabold text-white mt-5 bg-orange-700 hover:bg-orange-500 cursor-pointer transition-all duration-300 rounded-3xl text-[16px] shadow">
                Login
              </button>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
