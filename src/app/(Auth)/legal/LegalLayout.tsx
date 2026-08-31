import React from "react";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="main-content mx-auto max-w-3xl px-5 py-16 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <h1 className="text-4xl font-bold text-orange-700 dark:text-orange-400">{title}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: {updated}</p>
      <div
        className="
          mt-8 space-y-4 leading-relaxed
          [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-orange-700 [&_h2:not(:first-child)]:dark:text-orange-400
          [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
          [&_a]:text-orange-700 [&_a]:underline dark:[&_a]:text-orange-400
        "
      >
        {children}
      </div>
    </main>
  );
}
