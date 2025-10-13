"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.image";
import type { PortableTextBlock } from "@portabletext/types";

export default function BlogContent({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose prose-lg prose-orange max-w-none">
      <PortableText
        value={value}
        components={{
          types: {
            // ✅ Images inside body
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
                    <figcaption className="text-center text-sm text-gray-500 mt-2">
                      {value.alt}
                    </figcaption>
                  )}
                </figure>
              );
            },
          },
          marks: {
            // ✅ Links
            link: ({ children, value }) => (
              <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-700 hover:text-orange-800 underline"
              >
                {children}
              </a>
            ),
          },
          block: {
            // ✅ Paragraphs
            normal: ({ children }) => (
              <p className="text-gray-800 leading-relaxed my-5">{children}</p>
            ),

            // ✅ Headings (H1–H6)
            h1: ({ children }) => (
              <h1 className="text-4xl font-extrabold mt-12 mb-6 text-gray-900">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-bold mt-10 mb-5 text-gray-900 border-l-4 border-orange-700 pl-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-800">
                {children}
              </h4>
            ),
            h5: ({ children }) => (
              <h5 className="text-lg font-medium mt-4 mb-2 text-gray-700">
                {children}
              </h5>
            ),
            h6: ({ children }) => (
              <h6 className="text-base font-medium mt-3 mb-2 text-gray-600">
                {children}
              </h6>
            ),

            // ✅ Blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-orange-400 pl-4 italic text-gray-600 my-6">
                {children}
              </blockquote>
            ),
          },
          list: {
            // ✅ Unordered lists
            bullet: ({ children }) => (
              <ul className="list-disc list-inside my-5 space-y-2">{children}</ul>
            ),
            // ✅ Ordered lists
            number: ({ children }) => (
              <ol className="list-decimal list-inside my-5 space-y-2">{children}</ol>
            ),
          },
          listItem: {
            // ✅ List items
            bullet: ({ children }) => (
              <li className="ml-4 text-gray-800">{children}</li>
            ),
            number: ({ children }) => (
              <li className="ml-4 text-gray-800">{children}</li>
            ),
          },
        }}
      />
    </div>
  );
}
