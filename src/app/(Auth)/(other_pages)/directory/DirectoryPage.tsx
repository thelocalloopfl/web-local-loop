/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { fetchActiveBusinesses } from '../../../../lib/fetchDirectory'

// --- TYPE DEFINITIONS ---
type Business = {
  _id: string
  name: string
  slug?: { current: string }
  category?: string
  description?: string
  website?: string
  email?: string
  phone?: string
  tier: 'gold' | 'silver' | 'bronze'
  active?: boolean
  startDate?: string | null
  endDate?: string | null
  logoUrl?: string
  featureImageUrl?: string
  adLinkUrl?: string
}

// --- UTILITIES ---
const TIER_ORDER: Record<Business['tier'], number> = { gold: 0, silver: 1, bronze: 2 }

function withinDateWindow(start?: string | null, end?: string | null): boolean {
  const now = new Date().getTime()
  const s = start ? new Date(start).getTime() : -Infinity
  const e = end ? new Date(end).getTime() : Infinity
  return now >= s && now <= e
}

function normalize(str?: string): string {
  return (str || '').toLowerCase().trim()
}

// --- COMPONENTS ---

function TierBadge({ tier }: { tier: Business['tier'] }) {
  const label =
    tier === 'gold' ? 'Featured' : tier === 'silver' ? 'Standard' : 'Basic'
  const bg =
    tier === 'gold'
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : tier === 'silver'
      ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200'
  return (
    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${bg}`}>
      {label}
    </span>
  )
}

function GoldHeroCard({ b }: { b: Business }) {
  return (
    <article className="rounded-2xl border border-yellow-300 dark:border-yellow-700 bg-[var(--background)] text-[var(--foreground)] shadow-sm overflow-hidden transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Info */}
        <div className="p-6 lg:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {b.logoUrl ? (
              <img
                src={b.logoUrl}
                alt={`${b.name} Logo`}
                className="h-14 w-14 rounded-lg object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-gray-200 dark:bg-gray-800 grid place-items-center text-sm text-gray-600 dark:text-gray-300">
                LOGO
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-xl font-semibold">{b.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <TierBadge tier="gold" />
                {b.category && <span>• {b.category}</span>}
              </div>
            </div>
          </div>

          {b.description && (
            <p className="text-base text-gray-700 dark:text-gray-300">{b.description}</p>
          )}

          <div className="mt-auto flex flex-wrap gap-3 text-sm">
            {b.website && (
              <a
                href={b.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Visit Website
              </a>
            )}
            {b.email && (
              <a
                href={`mailto:${b.email}`}
                className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Email
              </a>
            )}
            {b.phone && (
              <a
                href={`tel:${b.phone}`}
                className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Call
              </a>
            )}
          </div>
        </div>

        {/* Right: Hero Banner */}
        <div className="relative min-h-56 lg:min-h-full">
          {b.featureImageUrl ? (
            b.adLinkUrl ? (
              <a
                href={b.adLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 block"
              >
                <img
                  src={b.featureImageUrl}
                  alt={`${b.name} banner`}
                  className="h-full w-full object-cover"
                />
              </a>
            ) : (
              <img
                src={b.featureImageUrl}
                alt={`${b.name} banner`}
                className="h-full w-full object-cover"
              />
            )
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
              Upload a banner image for Gold tier
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function StandardCard({ b }: { b: Business }) {
  const border =
    b.tier === 'silver'
      ? 'border-gray-300 dark:border-gray-700'
      : 'border-stone-300 dark:border-stone-700'

  return (
    <article
      className={`rounded-2xl border ${border} p-5 shadow-sm hover:shadow-md transition bg-[var(--background)] text-[var(--foreground)] flex flex-col gap-3 h-full`}
    >
      <div className="flex items-center gap-3">
        {b.logoUrl ? (
          <img
            src={b.logoUrl}
            alt={`${b.name} Logo`}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-800 grid place-items-center text-sm text-gray-600 dark:text-gray-300">
            LOGO
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{b.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <TierBadge tier={b.tier} />
            {b.category && <span>• {b.category}</span>}
          </div>
        </div>
      </div>

      {b.description && (
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {b.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-3 text-sm">
        {b.website && (
          <a
            href={b.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Website
          </a>
        )}
        {b.email && (
          <a
            href={`mailto:${b.email}`}
            className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Email
          </a>
        )}
        {b.phone && (
          <a
            href={`tel:${b.phone}`}
            className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Call
          </a>
        )}
      </div>
    </article>
  )
}

// --- MAIN COMPONENT ---
export default function DirectoryPageGoldHeroVariant() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    async function load() {
      try {
        const fetched = await fetchActiveBusinesses()
        setBusinesses(
          fetched.map((b: any) => ({
            ...b,
            tier: b.tier as Business['tier'],
            logoUrl: b.logo,
            featureImageUrl: b.featureImage,
            adLinkUrl: b.adLinkUrl,
          }))
        )
      } catch (err) {
        console.error(err)
        setError('Failed to load directory.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    businesses.forEach((b) => b.category && set.add(b.category))
    return ['all', ...Array.from(set).sort()]
  }, [businesses])

  if (loading)
    return (
      <main className="text-center py-20 text-xl text-[var(--foreground)]">
        Loading...
      </main>
    )
  if (error)
    return (
      <main className="text-center py-20 text-xl text-red-600 dark:text-red-400">
        {error}
      </main>
    )

  const visible = businesses
    .filter((b) => (b.active ?? true) && withinDateWindow(b.startDate, b.endDate))
    .filter((b) => {
      const q = normalize(query)
      const matchesQuery =
        !q ||
        normalize(b.name).includes(q) ||
        (b.category && normalize(b.category).includes(q))
      const matchesCategory =
        selectedCategory === 'all' ||
        (b.category && normalize(b.category) === normalize(selectedCategory))
      return matchesQuery && matchesCategory
    })
    .sort(
      (a, b) =>
        TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.name.localeCompare(b.name)
    )

  const gold = visible.filter((b) => b.tier === 'gold')
  const silver = visible.filter((b) => b.tier === 'silver')
  const bronze = visible.filter((b) => b.tier === 'bronze')

  return (
    <main className="">
      {/* Search + Filters */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-2xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* No Results */}
      {visible.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No businesses match your filters.
        </div>
      )}

      {/* Gold Section */}
      {gold.length > 0 && (
        <section className="space-y-6 mb-10">
          <h2 className="text-2xl font-extrabold">Featured Businesses</h2>
          <div className="grid grid-cols-1 gap-6">
            {gold.map((b) => (
              <GoldHeroCard key={b._id} b={b} />
            ))}
          </div>
        </section>
      )}

      {/* Silver Section */}
      {silver.length > 0 && (
        <>
          <div className="my-10 h-px bg-gray-200 dark:bg-gray-700" />
          <section className="space-y-6">
            <h2 className="text-2xl font-extrabold">Standard Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {silver.map((b) => (
                <StandardCard key={b._id} b={b} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Bronze Section */}
      {bronze.length > 0 && (
        <>
          <div className="my-10 h-px bg-gray-200 dark:bg-gray-700" />
          <section className="space-y-6">
            <h2 className="text-2xl font-extrabold">Basic Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bronze.map((b) => (
                <StandardCard key={b._id} b={b} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}