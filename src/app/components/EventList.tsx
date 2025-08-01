'use client';

import { useEffect, useState } from 'react';
import type { EventItem } from '../../../types/event';
import { fetchEvents, fetchCategories } from '../../../lib/queries';

type Props = {
  limit?: number;
  showFilters?: boolean;
};

export default function EventList({ limit = 3, showFilters = true }: Props) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(limit);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchEvents();
      setAllEvents(data);
      setEvents(data.slice(0, limit));
    };

    const loadCategories = async () => {
      const cats = await fetchCategories(); // Should return string[]
      setCategories(cats);
    };

    loadData();
    loadCategories();
  }, [limit]);

  useEffect(() => {
    let filtered = allEvents;

    if (search.trim()) {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((e) =>
        e.categories?.some((cat) => cat.title === selectedCategory)
      );
    }

    setEvents(filtered.slice(0, visibleCount));
  }, [search, selectedCategory, visibleCount, allEvents]);

  return (
    <div>
      {showFilters && (
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{event.title}</h3>
            <p className="text-sm text-gray-500">
              {event.publishedAt
                ? new Date(event.publishedAt).toLocaleDateString()
                : 'No date'}
            </p>
            <p className="text-sm text-gray-600">
              {event.categories?.map((cat) => cat.title).join(', ') || 'Uncategorized'}
            </p>
          </div>
        ))}
      </div>

      {events.length < allEvents.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 3)}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
}
