// EventSectionClient.tsx
'use client';

import EventList from './EventList';

export default function EventSectionClient({
  limit = 3,
  showFilters = false,
}: {
  limit?: number;
  showFilters?: boolean;
}) {
  return <EventList limit={limit} showFilters={showFilters} />;
}
