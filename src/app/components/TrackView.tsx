"use client";

import { useEffect } from "react";
import { event as gaEvent } from "../../../lib/gtag";

/**
 * Fires a single GA4 event when mounted. Lets server components record a
 * view without becoming client components themselves.
 */
export default function TrackView({
  name,
  params = {},
}: {
  name: string;
  params?: Record<string, string | number | boolean | undefined>;
}) {
  useEffect(() => {
    gaEvent(name, params);
    // Fire once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
