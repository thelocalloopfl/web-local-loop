import React from 'react'

import { fetchEvents  } from '../../../../../lib/queries';
import { fetchCategories } from '../../../../lib/fetchCategories';
import type { Metadata } from 'next';
import { fetchSiteLogo } from "@/lib/fetchLogo";
import { urlFor } from '@/lib/sanity.image';
import EventSection from '@/app/components/EventSection';
import EventSubmissionForm from '@/app/components/EventSubmissionForm';

export async function generateMetadata(): Promise<Metadata> {
  const logo = await fetchSiteLogo();
  const logoUrl = logo.logo
    ? urlFor(logo.logo).width(1200).height(630).url()
    : "https://thelocalloopfl.com/default-logo.png";

  return {
    title: "Winter Garden Events | The Local Loop",
    description:
      "Discover upcoming community events, festivals, and local happenings in Winter Garden. Stay connected with what's going on around you.",
    keywords: [
      "Winter Garden events",
      "community events Winter Garden",
      "local events Winter Garden",
      "Winter Garden festivals",
      "things to do in Winter Garden",
      "The Local Loop events",
      "Winter Garden activities",
    ],
    openGraph: {
      title: "Winter Garden Events | The Local Loop",
      description:
        "Stay informed about upcoming community events, festivals, and things to do in Winter Garden.",
      url: "https://thelocalloopfl.com/event",
      siteName: "The Local Loop FL",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "Winter Garden Community Events - The Local Loop",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Winter Garden Events | The Local Loop",
      description:
        "Explore upcoming community events, festivals, and activities in Winter Garden with The Local Loop.",
      images: [logoUrl],
    },
    alternates: {
      canonical: "https://thelocalloopfl.com/event",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

const Blog =  async () => {
const allEvents = await fetchEvents();
const eventCategories = await fetchCategories();

  return (
    <>
        <div className="main-content mx-auto px-5 py-16 text-black max-w-7xl">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-orange-700">
                  The Local Loop Events
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                  Your source for community events, local restaurant reviews, interview, guides and all other things Winter Garden.
                </p>
              </div>
            <EventSection allEvents={allEvents} categories={eventCategories} all={true} />

                    {/* 2. Add the EventSubmissionForm component */}
        <EventSubmissionForm />

            <div className="bg-gradient-to-r from-yellow-300 via-white to-orange-300 rounded-lg shadow p-2 mt-10 py-8 text-center lg:p-8">
              <h3 className="text-lg font-semibold">Want to promote your event?</h3>
              <p>Reach thousands of visitors every week!</p>
              <a href="/advertise" className="inline-block mt-2 bg-orange-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-orange-700">
                Advertise with Us
              </a>
            </div>
        </div>
    </>
  )
}

export default Blog