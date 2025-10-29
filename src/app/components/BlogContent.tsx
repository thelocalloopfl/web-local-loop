"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.image";
import type { PortableTextBlock } from "@portabletext/types";

export default function BlogContent({ value }: { value: PortableTextBlock[] }) {
  return (
    <div
      className="
        prose prose-lg max-w-none
        transition-colors duration-300
        text-[var(--foreground)]
        prose-headings:text-[var(--foreground)]
        prose-a:text-[var(--main-orange)] 
        prose-blockquote:border-[var(--main-orange)]
      "
    >
      <PortableText
        value={value}
        components={{
          types: {
            image: ({ value }) => {
              if (!value?.asset?._ref) return null;
              const imageUrl = urlFor(value).width(1200).url();

              return (
                <figure className="my-10">
                  <Image
                    src={imageUrl}
                    alt={value.alt || "Blog image"}
                    width={1000}
                    height={600}
                    className="rounded-xl shadow-md w-full object-cover"
                  />
                  {value.alt && (
                    <figcaption className="text-center text-sm text-[var(--muted-text)] mt-2">
                      {value.alt}
                    </figcaption>
                  )}
                </figure>
              );
            },
          },
          marks: {
            link: ({ children, value }) => (
              <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                {children}
              </a>
            ),
          },
          block: {
            normal: ({ children }) => (
              <p className="leading-relaxed my-5 text-[var(--foreground)]">{children}</p>
            ),
            h1: ({ children }) => (
              <h1 className="text-4xl font-extrabold mt-12 mb-6">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-bold mt-10 mb-5 border-l-4 border-[var(--main-orange)] pl-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-semibold mt-8 mb-4">{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-xl font-semibold mt-6 mb-3">{children}</h4>
            ),
            h5: ({ children }) => (
              <h5 className="text-lg font-medium mt-4 mb-2">{children}</h5>
            ),
            h6: ({ children }) => (
              <h6 className="text-base font-medium mt-3 mb-2">{children}</h6>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[var(--main-orange)] pl-4 italic my-6 text-[var(--muted-text)]">
                {children}
              </blockquote>
            ),
          },
          list: {
            bullet: ({ children }) => (
              <ul className="list-disc list-inside my-5 space-y-2">{children}</ul>
            ),
            number: ({ children }) => (
              <ol className="list-decimal list-inside my-5 space-y-2">{children}</ol>
            ),
          },
          listItem: {
            bullet: ({ children }) => <li className="ml-4">{children}</li>,
            number: ({ children }) => <li className="ml-4">{children}</li>,
          },
        }}
      />
    </div>
  );
}
