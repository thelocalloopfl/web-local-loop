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
  const styles =
    tier === 'gold'
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : tier === 'silver'
      ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200'
  return (
    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  )
}

function GoldHeroCard({ b }: { b: Business }) {
  const glow = 'shadow-2xl ring-4 ring-yellow-400/50 dark:ring-yellow-700/50'
  const buttonBase =
    'rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm transition font-medium'
  const orangeHover =
    'bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 hover:border-orange-500 text-orange-700 dark:text-orange-300'

  return (
    <article
      className={`rounded-2xl border border-yellow-300 dark:border-yellow-700 bg-[var(--background)] text-[var(--foreground)] overflow-hidden transition-colors duration-300 ${glow}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left info */}
        <div className="p-6 lg:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {b.logoUrl ? (
              <img
                src={b.logoUrl}
                alt={`${b.name} Logo`}
                className="h-14 w-14 rounded-lg object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-gray-200 dark:bg-gray-800 grid place-items-center text-sm">
                LOGO
              </div>
            )}
            <div>
              <h3 className="truncate text-xl font-semibold">{b.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <TierBadge tier="gold" />
                {b.category && <span>• {b.category}</span>}
              </div>
            </div>
          </div>
          {b.description && <p className="text-base text-gray-700 dark:text-gray-300">{b.description}</p>}

          <div className="mt-auto flex flex-wrap gap-3 text-sm">
            {b.website && (
              <a href={b.website} target="_blank" rel="noopener noreferrer" className={`${buttonBase} ${orangeHover}`}>
                Visit Website
              </a>
            )}
            {b.email && (
              <a href={`mailto:${b.email}`} className={`${buttonBase} ${orangeHover}`}>
                Email
              </a>
            )}
            {b.phone && (
              <a href={`tel:${b.phone}`} className={`${buttonBase} ${orangeHover}`}>
                Call
              </a>
            )}
          </div>
        </div>

        {/* Right banner */}
        <div className="relative h-60 lg:min-h-full">
          {b.featureImageUrl ? (
            b.adLinkUrl ? (
              <a href={b.adLinkUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
                <img src={b.featureImageUrl} alt={`${b.name} banner`} className="h-full w-full object-cover" />
              </a>
            ) : (
              <img src={b.featureImageUrl} alt={`${b.name} banner`} className="h-full w-full object-cover" />
            )
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Gold Tier: Needs a banner image.
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function StandardCard({ b }: { b: Business }) {
  const glow =
    b.tier === 'silver'
      ? 'border-gray-300 dark:border-gray-700 shadow-xl ring-2 ring-gray-300/50 dark:ring-gray-600/40'
      : 'border-stone-300 dark:border-stone-700 shadow-xl ring-2 ring-stone-300/50 dark:ring-stone-600/40'
  const buttonBase =
    'rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm transition font-medium'
  const orangeHover =
    'bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 hover:border-orange-500 text-orange-700 dark:text-orange-300'

  return (
    <article
      className={`rounded-2xl p-5 flex flex-col gap-3 h-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 ${glow}`}
    >
      <div className="flex items-center gap-3">
        {b.logoUrl ? (
          <img src={b.logoUrl} alt={`${b.name} Logo`} className="h-12 w-12 rounded-lg object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-800 grid place-items-center text-sm">LOGO</div>
        )}
        <div>
          <h3 className="truncate text-lg font-semibold">{b.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <TierBadge tier={b.tier} />
            {b.category && <span>• {b.category}</span>}
          </div>
        </div>
      </div>

      {b.description && <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{b.description}</p>}

      <div className="mt-auto flex flex-wrap gap-3 text-sm">
        {b.website && (
          <a href={b.website} target="_blank" rel="noopener noreferrer" className={`${buttonBase} ${orangeHover}`}>
            Website
          </a>
        )}
        {b.email && (
          <a href={`mailto:${b.email}`} className={`${buttonBase} ${orangeHover}`}>
            Email
          </a>
        )}
        {b.phone && (
          <a href={`tel:${b.phone}`} className={`${buttonBase} ${orangeHover}`}>
            Call
          </a>
        )}
      </div>
    </article>
  )
}

// --- MAIN PAGE ---
export default function DirectoryPageGoldHeroVariant() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | false>(false)
  const [showCategories, setShowCategories] = useState(false)

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
    return [...Array.from(set)].sort()
  }, [businesses])

  if (loading)
    return (
      <main className="text-center py-20 text-xl text-[var(--foreground)] transition-colors duration-300">
        Loading...
      </main>
    )
  if (error)
    return (
      <main className="text-center py-20 text-xl text-red-600 dark:text-red-400">{error}</main>
    )

  const visible = businesses
    .filter((b) => (b.active ?? true) && withinDateWindow(b.startDate, b.endDate))
    .filter((b) => {
      const q = normalize(query)
      const matchQuery = !q || normalize(b.name).includes(q) || (b.category && normalize(b.category).includes(q))
      const matchCat = category === false || (b.category && normalize(b.category) === normalize(category))
      return matchQuery && matchCat
    })
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.name.localeCompare(b.name))

  const gold = visible.filter((b) => b.tier === 'gold')
  const silver = visible.filter((b) => b.tier === 'silver')
  const bronze = visible.filter((b) => b.tier === 'bronze')

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Search + Filter */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 mb-10">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 pl-10 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
        </div>

        {/* Category Filter */}
{/* Category Filter (Updated Design) */}
<div className="relative">
  <button
    type="button"
    onClick={() => setShowCategories((v) => !v)}
    className="
      w-full md:text-lg px-4 py-2 border border-orange-700 rounded-xl font-semibold
      bg-[var(--background)] text-orange-700 dark:text-orange-400 dark:border-orange-500
      hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 
      transition duration-200 flex items-center justify-center gap-1
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 4h18M4 8h16M6 12h12M9 16h6"
      />
    </svg>
    Filter by Category
  </button>

  {showCategories && (
    <div
      className="
        absolute z-20 mt-2 w-full bg-[var(--background)] 
        border border-gray-200 dark:border-gray-700 
        rounded-xl shadow-xl max-h-64 overflow-y-auto
        transition-colors duration-200
      "
    >
      <button
        className={`block w-full text-left px-4 py-2 hover:bg-orange-200 dark:hover:bg-gray-800 ${
          category === false
            ? 'font-bold text-orange-700 dark:text-orange-500'
            : 'hover:text-black'
        }`}
        onClick={() => {
          setCategory(false)
          setShowCategories(false)
        }}
      >
        All Categories
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          className={`block w-full text-left px-4 py-2 hover:bg-orange-200 dark:hover:bg-gray-800 ${
            category === cat
              ? 'font-bold text-orange-700 dark:text-orange-500'
              : 'hover:text-black'
          }`}
          onClick={() => {
            setCategory(cat)
            setShowCategories(false)
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )}
</div>

      </div>

      {/* Results */}
      {visible.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg py-12">No businesses match your filters.</div>
      ) : (
        <>
          {gold.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-extrabold">Featured Businesses</h2>
              <div className="grid grid-cols-1 gap-6">
                {gold.map((b) => (
                  <GoldHeroCard key={b._id} b={b} />
                ))}
              </div>
            </section>
          )}

          {silver.length > 0 && (
            <>
              <div className="my-12 h-px bg-gray-200 dark:bg-gray-700" />
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

          {bronze.length > 0 && (
            <>
              <div className="my-12 h-px bg-gray-200 dark:bg-gray-700" />
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
        </>
      )}
    </main>
  )
}
