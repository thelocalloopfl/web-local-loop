'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { sanityClient, urlFor } from '@/lib/sanity';


interface SiteLogo {
  logo: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  alt: string;
  title: string;
}

export default function Header() {
  const [logo, setLogo] = useState<SiteLogo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "siteLogo"][0]{ logo, alt, title }`)
      .then((data) => setLogo(data));
  }, []);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Blog', href: '/blog' },
    { name: 'Local Spotlight', href: '/local-spotlight' },
    { name: 'Shop', href: '/shop' },
    { name: 'Advertise', href: '/advertise' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="main-header py-4 shadow-md">
      <div className="main-header-inner flex items-center justify-between relative">
        <div className="flex items-center space-x-4">
          <div className="site-logo">
            {logo?.logo && (
              <Image
                src={urlFor(logo.logo).width(120).url()}
                width={120}
                height={60}
                alt={logo.alt || 'Logo'}
              />
            )}
          </div>
          <div className="site-title">
            {logo?.title && (
              <span className="text-xl font-bold text-gray-800">{logo.title}</span>
            )}
          </div>
        </div>
        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {menuItems.map((item) => {
            const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'relative transition-colors duration-200 px-1' +
                  (isActive
                    ? ' text-yellow-400 font-semibold after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-yellow-400 after:rounded-full after:content-[""]'
                    : ' text-white hover:text-yellow-400')
                }
                style={{ display: 'inline-block', paddingBottom: '4px' }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center px-2 py-1 text-white focus:outline-none"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute right-0 top-full mt-2 bg-[#20293a] text-white rounded shadow-lg border border-gray-700 z-50 animate-fade-in min-w-[180px]">
          <nav className="flex flex-col py-4 px-6 gap-2">
            {menuItems.map((item) => {
              const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    'py-2 px-1 rounded transition-colors duration-200' +
                    (isActive
                      ? ' text-yellow-400 font-semibold underline underline-offset-4 decoration-2'
                      : ' text-white hover:text-yellow-400')
                  }
                  style={{ display: 'block' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
