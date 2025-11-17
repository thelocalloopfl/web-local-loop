'use client'

import React, { useEffect, useMemo, useState, useTransition } from 'react'
import { fetchActiveBusinesses } from '@/lib/fetchDirectory'
import { dailyShuffle, isActiveByDate } from '@/lib/rotation'
import { FaStore } from 'react-icons/fa'
import Link from 'next/link'

type Tier = 'hero' | 'pro' | 'standard' | 'basic' | 'free'

type DirectoryListing = {
  _id: string
  name: string
  logo?: string
  featureImage?: string
  url?: string
  blurb?: string
  tier: Tier
  isActive?: boolean
  start?: string
  end?: string
  category?: string
  website?: string
  email?: string
  phone?: string
}

const NoDataFallback = ({
  title,
  icon,
  message,
  buttonText,
  buttonLink,
}: {
  title: string
  icon: React.ReactNode
  message: string
  buttonText?: string
  buttonLink?: string
}) => (
  <div className="text-center p-10 border border-dashed border-[var(--border-color)] rounded-lg mx-auto max-w-xl my-8">
    <div className="text-4xl text-[var(--main-orange)] mx-auto mb-4 w-fit">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-[var(--text-muted)]">{message}</p>
    {buttonText && buttonLink && (
      <a
        href={buttonLink}
        className="mt-4 inline-block bg-[var(--main-orange)] text-white px-4 py-2 rounded transition-opacity hover:opacity-90"
      >
        {buttonText}
      </a>
    )}
  </div>
)

export default function DirectoryPage() {
  const [listings, setListings] = useState<DirectoryListing[]>([])
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategories, setShowCategories] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchActiveBusinesses()
        setListings(data)
      } catch (err) {
        console.error('Error fetching directory:', err)
      }
    }
    load()
  }, [])

  const now = new Date()
  const active = useMemo(
    () =>
      listings.filter(
        (l) =>
          (l.isActive ?? true) &&
          isActiveByDate(l.start, l.end, now) &&
          (!query ||
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.blurb?.toLowerCase().includes(query.toLowerCase())) &&
          (!selectedCategory ||
            l.category?.toLowerCase() === selectedCategory.toLowerCase())
      ),
    [listings, query, selectedCategory, now]
  )

  const hero = active.find((l) => l.tier === 'hero')
  const paid = active.filter((l) => ['pro', 'standard', 'basic'].includes(l.tier))
  const free = dailyShuffle(active.filter((l) => l.tier === 'free'))

  const categories = useMemo(() => {
    const set = new Set<string>()
    listings.forEach((l) => l.category && set.add(l.category))
    return Array.from(set)
  }, [listings])

  const hasListings = active.length > 0

const renderButtons = (b: DirectoryListing) => (
  <div className="mt-auto flex flex-wrap gap-3 text-sm">
    {b.url && (
      <Link
        href={b.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 font-medium text-gray-800 dark:text-gray-200 shadow-sm hover:bg-[var(--main-orange)] hover:text-white hover:shadow-md transition-all duration-200"
      >
        Visit Website
      </Link>
    )}
    {b.email && (
      <Link
        href={`mailto:${b.email}`}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 font-medium text-gray-800 dark:text-gray-200 shadow-sm hover:bg-[var(--main-orange)] hover:text-white hover:shadow-md transition-all duration-200"
      >
        Email
      </Link>
    )}
    {b.phone && (
      <Link
        href={`tel:${b.phone}`}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 font-medium text-gray-800 dark:text-gray-200 shadow-sm hover:bg-[var(--main-orange)] hover:text-white hover:shadow-md transition-all duration-200"
      >
        Call
      </Link>
    )}
  </div>
)


  return (
    <main className="mx-auto max-w-7xl px-4 py-10 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* 🔍 Search + Filter */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 mb-10">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses..."
            className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 pl-10 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[var(--background)] text-[var(--foreground)]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategories((v) => !v)}
            className="w-full md:text-lg px-4 py-2 border border-orange-700 rounded-xl font-semibold bg-[var(--background)] text-orange-700 dark:text-orange-400 dark:border-orange-500 hover:bg-orange-600 hover:text-white transition duration-200 flex items-center justify-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M4 8h16M6 12h12M9 16h6" />
            </svg>
            {selectedCategory ? selectedCategory : 'Filter by Category'}
          </button>

          {showCategories && (
            <div className="absolute z-10 mt-2 w-full bg-[var(--background)] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-orange-200 dark:hover:bg-gray-800 ${
                  selectedCategory === null ? 'font-bold text-orange-700 dark:text-orange-500' : ''
                }`}
                onClick={() => {
                  setSelectedCategory(null)
                  setShowCategories(false)
                }}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`block w-full text-left px-4 py-2 hover:bg-orange-200 hover:text-black ${
                    selectedCategory === cat ? 'font-bold text-orange-700 dark:text-orange-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat)
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

      {/* 🏪 Directory Results */}
      {!hasListings ? (
        <NoDataFallback
          title="No Active Listings Found"
          icon={<FaStore />}
          message="We’re updating our local business directory. Please check back soon!"
          buttonText="Add Your Business"
          buttonLink="/contact"
        />
      ) : (
        <>
          {/* 🦸 Hero */}
          {hero && (
            <div className="block rounded-2xl overflow-hidden shadow-lg mb-10 border border-white/10 hover:shadow-xl transition bg-[var(--background)]">
              {hero.featureImage ? (
                <img src={hero.featureImage} alt={hero.name} className="w-full h-64 object-cover" />
              ) : (
                <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 h-64">
                  <img src={hero.logo ?? ''} alt={hero.name} className="h-20 w-auto object-contain" />
                </div>
              )}
              <div className="p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  {hero.logo && <img src={hero.logo} alt={hero.name} className="h-10 w-10 rounded object-cover" />}
                  <h2 className="text-2xl font-bold">{hero.name}</h2>
                </div>
                {hero.blurb && <p className="text-gray-600 dark:text-gray-300 mb-4">{hero.blurb}</p>}
                <span className="w-30 text-center bg-[var(--main-orange)] text-white text-sm px-3 py-1 rounded-full mb-3">
                  Hero Listing
                </span>
                {renderButtons(hero)}
              </div>
            </div>
          )}

          {/* 💎 Paid Cards */}
          {paid.length > 0 && (
            <section className="mb-10">
              <h3 className="text-xl font-semibold mb-4">Premium Listings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paid.map((b) => (
                  <div
                    key={b._id}
                    className="flex flex-col rounded-xl overflow-hidden shadow border border-white/10 bg-white/5 dark:bg-gray-900/30 hover:bg-white/10 transition p-5"
                  >
                    <div className="flex items-center gap-3">
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded grid place-items-center text-xs">Logo</div>
                      )}
                      <div className="flex flex-col">
                        <h4 className="font-semibold text-lg">{b.name}</h4>
                        <span className="text-xs opacity-70 capitalize">{b.category ?? 'General'}</span>
                      </div>
                    </div>
                    {b.blurb && <p className="mt-2 text-sm opacity-80 line-clamp-3">{b.blurb}</p>}
                    <div className="my-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--main-orange)] text-white capitalize">
                        {b.tier} Listing
                      </span>
                    </div>
                    {renderButtons(b)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 🌱 Free Cards */}
          {free.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-4">Community Listings</h3>
              <div className="divide-y divide-white/10 rounded-xl overflow-hidden shadow border border-white/10">
                {free.map((b) => (
                  <div
                    key={b._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between shadow border border-white/10 bg-white/5 dark:bg-gray-900/30 hover:bg-white/10 transition p-5"
                  >
                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                      {b.logo && <img src={b.logo} alt={b.name} className="h-8 w-8 rounded object-cover" />}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{b.name}</span>
                        <span className="text-xs opacity-70 capitalize">{b.category ?? 'General'}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--main-orange)] text-white capitalize">Free</span>
                    </div>
                    {renderButtons(b)}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}
