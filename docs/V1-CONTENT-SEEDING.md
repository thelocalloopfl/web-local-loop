# V1 Content Seeding — Operations Requirements

The site is technically ready for launch. The remaining gate is **real local
content**, entered in Sanity Studio (`sanity dev` → `http://localhost:3333/`,
project `h0p4hnwf`, dataset `production`).

Claude cannot create this content: it must not fabricate business names, event
details, phone numbers, or quotes, and it has no Sanity write credential.

---

## 0. Remove existing test content (do this first)

Delete or unpublish in Studio:

| Type | Documents to remove |
| --- | --- |
| Event | "Event 1", "Work Event 2", "Adult Event", "Event 2", "Family Event", "Kids Events" (all 6 are placeholders) |
| Directory (`directory` type) | "Services B", "Services", "Shop B", "Restaurant ", "Test Shop", "Restaurant B" (all 6 — and note the site now reads the new `Directory Listing` type, not this one) |
| Blog | "TEST — HOOK DEPLOY." and "Career Progression in Structural Engineering: From Beginner to Leader" (off-topic) |
| Spotlight | Confirm "Garden Grove Cafe", "WG Bike & Trail Outfitters", "The Artisan's Nook", "Summer Mega Sale 2025" are real. If invented, remove or replace. |

---

## 1. Business Directory — REQUIRED for launch

**Minimum: 15–20 real Winter Garden / West Orange County businesses.**
Use the **Directory Listing** type (not the old "Directory Settings").

Per business:
- **Business Name** (required)
- **Category** — pick a consistent label: `Restaurants`, `Shops`, `Services`,
  `Health & Wellness`, `Home & Trades`, `Professional`. Spelling must match
  across listings or the filter splits them.
- **Short Description** — 1–2 sentences, factual, from the business's own
  website/Google Business Profile.
- **Logo** and/or **Feature Image** — only if you have rights to use them.
- **Website / Email / Phone** — from public listings.
- **Placement Tier** — `free` for the initial seed set (complimentary
  listings). Set `hero` / `pro` / `standard` / `basic` only for businesses that
  have actually purchased a partnership.
- **Active** — on.

Legitimate sources: each business's own website and public Google Business
Profile. Do **not** scrape Yelp/Google reviews or copy third-party editorial
text. Prefer asking businesses directly (a free launch listing is an easy yes).

---

## 2. Events — REQUIRED for launch

**Minimum: 6–10 real upcoming events** (next ~8 weeks). Past events are hidden
automatically.

Per event (all fields are required by the schema):
- **Title** — the real event name
- **Description** — what/where/when in plain text (the schema has no separate
  venue or time field, so put the venue, address, date, and time in the
  description)
- **Publish Date** — set this to the **event date**
- **Image** — event flyer or a representative photo you have rights to
- **Categories** — at least one (create categories like `Music`, `Family`,
  `Food & Drink`, `Community`, `Arts`, `Outdoors`)
- **Slug** — auto-generates from the title

Legitimate sources: the City of Winter Garden events calendar, the Downtown
Winter Garden / Farmers Market schedules, venue and library calendars, and
event organizers directly. Summarize facts (date, time, place, what it is) in
your own words — do not copy promotional copy verbatim.

---

## 3. Articles / Guides — mostly done

There are 11 solid local blog posts already ("10 Coffee Shops in Winter Garden
That Locals Love", etc.). For launch:
- Publish **1–2 fresh posts** dated within the last 2 weeks so `/blog` looks
  current (a "This Weekend in Winter Garden" roundup works well and is reusable
  weekly).
- Confirm every post has: Title, Publish Date, Category, Short Description,
  Image, Author, and Body content.

---

## 4. Newsletter — READY, no engineering needed

Beehiiv is live (`thelocalloopfl.beehiiv.com`) with real past issues, and the
site's subscribe flow reaches Beehiiv successfully. Operations only needs to
keep publishing issues on the intended cadence (the site copy promises a
**weekly Friday** newsletter — hold to that or update the copy).

---

## 5. Site configuration docs in Sanity

- **Site Logo** — 1 exists. Confirm it's the final logo.
- **Banner Section** (homepage hero) — 1 exists. Confirm heading, subheading,
  and both button links point somewhere real (e.g. `/newsletter`, `/directory`).
- **Social Links** — **none exist**, so the footer shows no social icons.
  Create a `socialLinks` document with the real Facebook / Instagram / X URLs.
- **Contact** — no `contact` document exists; the contact form works without
  one, but add it if any contact-page content is schema-driven.
- **Top / Middle Banner, Sidebar ads** — optional; leave empty until a
  business buys ad placement.

---

## 6. Legal — REQUIRED before launch

`/privacy` and `/terms` are drafted and live but contain placeholders. Isaac
must confirm: the legal entity name, a mailing address, the effective date, and
that the refund / cancellation language matches how partnerships actually work.
(Search the two files for `NOTE FOR ISAAC`.)

---

## Launch checklist

- [ ] Test events, test directory entries, and 2 test blog posts removed
- [ ] 15+ real Directory Listings (tier `free`), consistent categories
- [ ] 6+ real upcoming Events with images and categories
- [ ] 1–2 fresh blog posts dated this month
- [ ] Social Links document created
- [ ] Homepage Banner links verified
- [ ] `/privacy` and `/terms` reviewed and finalized
- [ ] `v1-launch-prep` merged to `main` and Production deploy verified
