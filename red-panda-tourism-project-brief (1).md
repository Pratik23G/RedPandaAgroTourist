# Red Panda Agro Tourist — Full-Stack Website Project Brief

> **Purpose of this file:** Hand this to Claude Code as the project spec (drop it in the repo root as `CLAUDE.md` or paste it as the kickoff prompt). It contains the business context, all package/pricing data, tech stack, security requirements, and a phased plan.

---

## 1. Business Context

**Company:** Red Panda Agro Tourist Tours & Travel Pvt. Ltd
**What they do:** Eco-tourism and agro-tourism in the Tumling / Singhalila region (Nepal–India border, Eastern Himalayas). Core offerings: guided red panda tracking, bird watching, cultural village tours, homestays with local farmers, cowshed camping, and Land Rover sightseeing packages.
**Offices:**
- Tumling Office: +91 7063727464
- Kathmandu Office: +977 9823808506

**Competitor reference:** A similar operator ("Call of Wild Wings") runs a 4N/5D Red Panda Expedition at $600–$2,330/person depending on group size. Our positioning: all-inclusive pricing (including the KTM–Bhadrapur domestic flight), authentic village/agro experiences, and simpler flat per-person rates.

**End goal:** A production-ready, mobile-first marketing + booking-inquiry website that:
1. Showcases all tour packages with tiered pricing by visitor origin (Nepali locals, SAARC-region foreigners, international visitors).
2. Converts visitors into booking inquiries (form + WhatsApp/phone CTAs) — no online payment in v1.
3. Looks professional and loads fast on cheap Android phones on slow rural connections AND on desktop, with zero loss of visual quality across breakpoints.
4. Protects customer data (names, passport info if collected later, contact details) with real security hygiene.

---

## 2. Packages & Pricing (source of truth)

### International Package — $850 USD per person, 6 days
*(Foreigners from abroad — priced higher due to tariffs and international flight costs)*
- KTM–Bhadrapur domestic flight included
- Airport pickup + tea-estate stay & sightseeing at Ilam (en route from Bhadrapur airport)
- 4 days red panda sighting + bird watching
- Cultural village tour
- Food, accommodation, and snacks included
- Guide and all transportation included

### Regional Package — $450 USD per person, 6 days
*(Foreigners from India, Bangladesh, Pakistan)*
- Identical inclusions to the International Package:
  - KTM–Bhadrapur flight
  - Airport pickup + Ilam tea-estate stay & sightseeing
  - 4 days red panda sighting + bird watching
  - Cultural village tour
  - Food, accommodation, snacks
  - Guide and transportation

### Existing Local Packages (from current Nepali-market brochure)
| Package | Details | Price |
|---|---|---|
| Red Panda Watching / Birding | 2–3 days, Land Rover + guide. **Guarantee: if no red panda seen in 2–3 days, package cost is not charged.** Priced for 2-person and 4-person groups (confirm exact rates with owner). | TBC |
| Cowsheds Camping & Barbecue | Jungle camping with cows, wild animals, birds. Dinner, breakfast, tent included. | Rs. 1,200 / person |
| Agro Tourist Package | Lodging in village farmer homes, organic food, hands-on agriculture experience, cultural exchange. | Rs. 1,000 / person / day |
| Tumling Sightseeing (6 persons) | Land Rover + guide: Tumling Ram Mandir, Singhalila National Park (birding + Kanchenjunga view from Stupa View Point), Gurashe Sherpa cultural & water monastery, Devi Cave, Gufadada (rolling clouds, spongy grass walk), Tumling Fatak (Kanchenjunga + Everest view). | Rs. 3,000 / 6 persons |
| Double Mazza Package (6 persons) | Everything above **plus** Meghma Monastery, Tonglu Lake, Jaubari heritage village (agricultural farming, in Nepal). | Rs. 3,000 & Rs. 7,000 / 6 persons |

**Pricing display rule:** Show USD for the two foreigner packages and NPR (Rs.) for local packages. Add a small note that regional/local rates may require ID verification at booking. Get owner confirmation on any "TBC" prices before launch — do NOT invent numbers.

**Unique selling points to feature prominently:**
- "No red panda sighting = no charge" guarantee (huge trust signal — hero-level content)
- All-inclusive pricing including domestic flight
- Authentic farm-stay / cultural immersion, run by local families
- Everest + Kanchenjunga views in a single trip

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSG/ISR for fast static marketing pages, API routes for the inquiry form, built-in image optimization. |
| Styling | **Tailwind CSS** | Rapid responsive design, consistent design tokens. |
| UI components | shadcn/ui (selective) | Accessible primitives (dialog, form, accordion) without bloat. |
| Database | **PostgreSQL** (Neon or Supabase free tier) | Store booking inquiries, package data, testimonials. |
| ORM | **Prisma** | Type-safe queries, easy migrations. |
| Validation | **Zod** | Shared client/server schema validation for all form input. |
| Email | **Resend** (or Nodemailer + SMTP) | Inquiry notifications to owner + auto-confirmation to customer. |
| Forms anti-spam | Cloudflare Turnstile (or honeypot + rate limit) | Free, privacy-friendlier than reCAPTCHA. |
| Images | **next/image** + AVIF/WebP, blur placeholders | Responsive `srcset`, no quality loss at small sizes. |
| i18n | **next-intl** — English + Nepali (नेपाली) | Two audiences, two languages. English default. |
| Analytics | Plausible or Vercel Analytics | Cookie-light, no consent-banner headache. |
| Hosting | **Vercel** (free tier) | Zero-ops, global CDN, HTTPS by default. |
| Repo/CI | GitHub + Vercel preview deploys | Standard flow. |

**v1 explicitly excludes online payments.** Booking = inquiry form → owner confirms via WhatsApp/email → payment offline or via bank transfer. (Stripe doesn't support Nepal-based accounts anyway; if payments come later, evaluate eSewa/Khalti for local and Wise/bank transfer for international.)

---

## 4. Site Map & Features

```
/                      Hero (red panda photo, guarantee badge), featured packages, USPs, testimonials, CTA
/packages              All packages, filterable: International / Regional / Local
/packages/[slug]       Package detail: itinerary day-by-day, inclusions, gallery, price, "Book Inquiry" CTA
/red-panda             The experience: tracking process, best seasons, bird species list, gallery
/about                 Company story, local family/community angle, offices, team
/gallery               Optimized photo gallery (lazy-loaded, lightbox)
/contact               Inquiry form + WhatsApp deep links + office phones + map (Tumling)
/book/[slug]           Booking inquiry form pre-filled with the package
/privacy               Privacy policy (required — we collect personal data)
```

**Key features:**
1. **Booking inquiry form:** name, email, phone/WhatsApp, country, package, group size, preferred dates, message. → saved to DB + emailed to owner + auto-reply to customer.
2. **Dynamic pricing display:** package cards show the right currency/tier; a simple selector ("I'm visiting from: Nepal / India–Bangladesh–Pakistan / Other countries") switches displayed rates site-wide (stored in localStorage-free state — use URL param or cookie set server-side).
3. **WhatsApp click-to-chat** buttons wired to office numbers with pre-filled message text.
4. **Itinerary component:** reusable day-by-day timeline (Day 1: KTM→Bhadrapur→Ilam tea stay… etc.).
5. **SEO:** metadata per page, OpenGraph images, structured data (`TouristTrip`, `LocalBusiness` JSON-LD), sitemap.xml, robots.txt. Target queries: "red panda tour Nepal", "Singhalila red panda tracking", "Tumling homestay".
6. **Performance budget:** Lighthouse ≥ 90 mobile on all pages; LCP < 2.5s on simulated 3G; total JS < 150KB gzipped on marketing pages.

---

## 5. Responsive & Image-Quality Requirements (non-negotiable)

- Mobile-first breakpoints: 360px → 768px → 1024px → 1440px+. Test at 360×640 explicitly.
- All photos through `next/image` with `sizes` attributes so devices download the correct resolution — **never** a scaled-down full-size JPEG.
- Serve AVIF/WebP with JPEG fallback; source images exported at 2x max display size; quality ~80.
- Use `priority` on the hero image only; lazy-load everything else.
- Text remains ≥16px on mobile; tap targets ≥44px; no horizontal scroll at any width.
- Gallery uses aspect-ratio boxes + blur-up placeholders to prevent layout shift (CLS < 0.1).

---

## 6. Security & Data Protection (customer data)

**Data we collect (v1):** name, email, phone, country, travel dates, group size, free-text message. This is PII — treat it accordingly.

1. **Transport:** HTTPS everywhere (Vercel default), HSTS header.
2. **Input handling:** Zod validation on server for every field; length limits; sanitize/escape before rendering anywhere (React handles most, but never `dangerouslySetInnerHTML` with user input).
3. **Injection:** Prisma parameterized queries only — no raw SQL string concatenation.
4. **Secrets:** all keys (DB URL, Resend key, Turnstile secret) in environment variables; `.env*` gitignored; never exposed to client (no `NEXT_PUBLIC_` prefix on secrets).
5. **Rate limiting:** inquiry endpoint limited (e.g., @upstash/ratelimit or simple IP-based limiter) — 5 submissions / 10 min / IP.
6. **Spam/abuse:** Turnstile or honeypot field + server-side timing check.
7. **Data minimization & retention:** collect only what's needed; document a retention window (e.g., delete inquiries after 12 months); no passport/payment data in v1.
8. **Access control:** if an admin view of inquiries is built, protect it with auth (NextAuth/Auth.js, single owner account, bcrypt/argon2 hashed credentials) — otherwise inquiries are viewed via email + DB console only.
9. **Headers:** CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy via `next.config` headers.
10. **Privacy policy page:** plain-language — what we collect, why, how long, how to request deletion (email contact). GDPR-aware since international (EU) visitors are a target market.
11. **Backups:** managed by Neon/Supabase; confirm point-in-time recovery is on.
12. **Logging:** never log full PII in server logs; log inquiry IDs, not bodies.

---

## 7. Skills Required (for whoever builds this)

- Next.js App Router: server components, route handlers, ISR/SSG, metadata API
- TypeScript (strict mode)
- Tailwind CSS responsive design + accessibility (semantic HTML, ARIA where needed, keyboard nav)
- PostgreSQL schema design + Prisma migrations
- Zod schema validation (shared client/server)
- Transactional email integration (Resend)
- Image optimization pipeline (sharp/next-image, AVIF/WebP)
- i18n with next-intl (EN/NE), including Devanagari font handling (Noto Sans Devanagari)
- Web security fundamentals: OWASP top 10, secure headers, rate limiting
- SEO: structured data, OpenGraph, Core Web Vitals
- Vercel deployment, environment management, preview workflows

---

## 8. Build Plan (phased)

**Phase 0 — Setup (½ day)**
- Init Next.js 15 + TS + Tailwind + Prisma; connect Neon/Supabase; Vercel project; CI previews.
- Define design tokens: earthy palette from the brochures (cream #EAE3D6-ish background, deep forest green, red-panda rust/orange accent), serif display + clean sans body.

**Phase 1 — Content & data model (1 day)**
- Prisma schema: `Package`, `ItineraryDay`, `Inquiry`, `Testimonial`.
- Seed all packages from Section 2. Content JSON/MDX for itineraries.
- Collect real photos from owner (brochure photos as placeholders).

**Phase 2 — Core pages (2–3 days)**
- Home, Packages list + detail, Red Panda experience page, About, Gallery, Contact.
- Pricing-tier selector, itinerary timeline component, WhatsApp CTAs.

**Phase 3 — Inquiry flow (1 day)**
- Form with Zod + Turnstile + rate limit → DB + Resend emails (owner notification + customer auto-reply).

**Phase 4 — i18n, SEO, polish (1–2 days)**
- Nepali translations, JSON-LD, OG images, sitemap, favicon/logo, 404 page.

**Phase 5 — Hardening & launch (1 day)**
- Security headers, Lighthouse pass on 360px/3G, privacy policy, cross-device QA (Android Chrome, iOS Safari, desktop), domain + DNS, launch.

**Definition of done:** all packages live with correct prices/currencies, inquiry form delivers email within 1 min, Lighthouse mobile ≥90 across pages, EN/NE toggle works, security checklist in Section 6 fully verified, owner can receive and respond to a test booking end-to-end.

---

## 9. Open Questions for the Owner (resolve before launch)

1. Exact prices for the 2-person and 4-person Red Panda Watching local packages (blank in brochure).
2. Does the "no sighting = no charge" guarantee apply to the new $850/$450 foreigner packages? (It's a killer marketing hook if yes.)
3. Preferred inquiry channel priority: email vs WhatsApp?
4. Domain name (e.g., redpandaagrotourist.com) — is one owned?
5. High-resolution original photos (brochure images are compressed).
6. Any peak/off-season pricing differences?
