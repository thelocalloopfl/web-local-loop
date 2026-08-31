import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center bg-white text-black dark:bg-black dark:text-white">
      <p className="text-sm font-semibold tracking-widest text-orange-700 dark:text-orange-400">
        THE LOCAL LOOP FL
      </p>
      <h1 className="text-4xl md:text-5xl font-bold">This page took a wrong turn</h1>
      <p className="max-w-md text-gray-600 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you
        back to what&apos;s happening around Winter Garden.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/home"
          className="rounded-lg bg-orange-700 dark:bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:opacity-90"
        >
          Go home
        </Link>
        <Link
          href="/event"
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2.5 font-medium transition hover:border-orange-500"
        >
          Browse events
        </Link>
        <Link
          href="/directory"
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2.5 font-medium transition hover:border-orange-500"
        >
          Business directory
        </Link>
      </div>
    </div>
  );
}
