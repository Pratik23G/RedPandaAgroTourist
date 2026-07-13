/**
 * Static, typed package data mirroring the Prisma `Package`/`ItineraryDay` shape
 * 1:1 (see prisma/schema.prisma). Pages import from here for now so `npm run dev`
 * works without a live DATABASE_URL. Once a real Postgres URL + seed are in place,
 * replace these imports with a Prisma-backed data-access module of the same shape.
 *
 * Source of truth for all figures: red-panda-tourism-project-brief.md §2.
 * Prices marked `priceConfirmed: false` are TBC in the source brochure — do not
 * present them as final; the UI must show a "confirm with owner" badge instead.
 */

export type PackageTier = "INTERNATIONAL" | "REGIONAL" | "LOCAL";
export type Currency = "USD" | "NPR";

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
}

export interface PackagePrice {
  amount: number | null;
  currency: Currency;
  unit: string;
  confirmed: boolean;
  /** Use when a single amount can't represent the brochure's price (e.g. two-tier group pricing). */
  displayOverride?: string;
}

export interface PackageData {
  slug: string;
  tier: PackageTier;
  name: string;
  summary: string;
  durationLabel: string;
  price: PackagePrice;
  guaranteeNoSighting: boolean;
  inclusions: string[];
  heroImage: string;
  galleryImages: string[];
  itineraryDays: ItineraryDay[];
  featured: boolean;
}

export const packages: PackageData[] = [
  {
    slug: "international-red-panda-expedition",
    tier: "INTERNATIONAL",
    name: "International Red Panda Expedition",
    summary:
      "All-inclusive 6-day expedition for visitors arriving from abroad — flight, tea-estate stay, red panda tracking, and a cultural village tour, all in one flat rate.",
    durationLabel: "6 days / 5 nights",
    price: { amount: 850, currency: "USD", unit: "per person", confirmed: true },
    guaranteeNoSighting: false,
    inclusions: [
      "KTM–Bhadrapur domestic flight",
      "Airport pickup",
      "Tea-estate stay & sightseeing at Ilam",
      "4 days red panda sighting + bird watching",
      "Cultural village tour",
      "Food, accommodation & snacks",
      "Guide and all transportation",
    ],
    heroImage: "/placeholders/hero-international.svg",
    galleryImages: [
      "/placeholders/gallery-red-panda-1.svg",
      "/placeholders/gallery-tea-estate.svg",
      "/placeholders/gallery-village.svg",
    ],
    itineraryDays: [
      { dayNumber: 1, title: "Arrival & Ilam Tea Estate", description: "Fly KTM–Bhadrapur, airport pickup, transfer to Ilam for tea-estate stay and sightseeing." },
      { dayNumber: 2, title: "Ilam to Tumling", description: "Scenic transfer to Tumling, orientation, and welcome dinner with the local host family." },
      { dayNumber: 3, title: "Red Panda Tracking, Day 1", description: "Guided red panda sighting and bird watching in Singhalila habitat." },
      { dayNumber: 4, title: "Red Panda Tracking, Day 2", description: "Continued tracking and birding, second habitat zone." },
      { dayNumber: 5, title: "Cultural Village Tour & Tracking, Day 3", description: "Morning cultural village tour with local farmers; afternoon red panda tracking." },
      { dayNumber: 6, title: "Final Tracking & Departure", description: "Last red panda tracking session, transfer to Bhadrapur, fly Bhadrapur–KTM." },
    ],
    featured: true,
  },
  {
    slug: "regional-red-panda-expedition",
    tier: "REGIONAL",
    name: "Regional Red Panda Expedition",
    summary:
      "The same all-inclusive 6-day expedition, priced for visitors from India, Bangladesh, and Pakistan.",
    durationLabel: "6 days / 5 nights",
    price: { amount: 450, currency: "USD", unit: "per person", confirmed: true },
    guaranteeNoSighting: false,
    inclusions: [
      "KTM–Bhadrapur domestic flight",
      "Airport pickup",
      "Tea-estate stay & sightseeing at Ilam",
      "4 days red panda sighting + bird watching",
      "Cultural village tour",
      "Food, accommodation & snacks",
      "Guide and all transportation",
    ],
    heroImage: "/placeholders/hero-regional.svg",
    galleryImages: [
      "/placeholders/gallery-red-panda-1.svg",
      "/placeholders/gallery-tea-estate.svg",
      "/placeholders/gallery-village.svg",
    ],
    itineraryDays: [
      { dayNumber: 1, title: "Arrival & Ilam Tea Estate", description: "Fly KTM–Bhadrapur, airport pickup, transfer to Ilam for tea-estate stay and sightseeing." },
      { dayNumber: 2, title: "Ilam to Tumling", description: "Scenic transfer to Tumling, orientation, and welcome dinner with the local host family." },
      { dayNumber: 3, title: "Red Panda Tracking, Day 1", description: "Guided red panda sighting and bird watching in Singhalila habitat." },
      { dayNumber: 4, title: "Red Panda Tracking, Day 2", description: "Continued tracking and birding, second habitat zone." },
      { dayNumber: 5, title: "Cultural Village Tour & Tracking, Day 3", description: "Morning cultural village tour with local farmers; afternoon red panda tracking." },
      { dayNumber: 6, title: "Final Tracking & Departure", description: "Last red panda tracking session, transfer to Bhadrapur, fly Bhadrapur–KTM." },
    ],
    featured: true,
  },
  {
    slug: "red-panda-watching-birding",
    tier: "LOCAL",
    name: "Red Panda Watching / Birding",
    summary:
      "Land Rover + guide outing with a standout guarantee: if no red panda is sighted in 2–3 days, the package is free.",
    durationLabel: "2–3 days",
    price: {
      amount: null,
      currency: "NPR",
      unit: "per person (2- or 4-person group)",
      confirmed: false,
      displayOverride: "Price TBC — confirm with owner",
    },
    guaranteeNoSighting: true,
    inclusions: ["Land Rover transportation", "Guide", "2–3 days red panda & bird watching"],
    heroImage: "/placeholders/hero-local.svg",
    galleryImages: ["/placeholders/gallery-red-panda-1.svg", "/placeholders/gallery-landrover.svg"],
    itineraryDays: [
      { dayNumber: 1, title: "Arrival & First Tracking", description: "Land Rover transfer into the park, first red panda and bird watching session." },
      { dayNumber: 2, title: "Full-Day Tracking", description: "Extended tracking and birding across additional habitat zones." },
      { dayNumber: 3, title: "Final Tracking Window", description: "Last chance tracking (within the guarantee window) and departure." },
    ],
    featured: true,
  },
  {
    slug: "cowshed-camping-barbecue",
    tier: "LOCAL",
    name: "Cowsheds Camping & Barbecue",
    summary: "Jungle camping alongside cows, wild animals, and birds, with dinner, breakfast, and tent included.",
    durationLabel: "1 night",
    price: { amount: 1200, currency: "NPR", unit: "per person", confirmed: true },
    guaranteeNoSighting: false,
    inclusions: ["Tent", "Dinner", "Breakfast", "Jungle camping experience"],
    heroImage: "/placeholders/hero-camping.svg",
    galleryImages: ["/placeholders/gallery-camping.svg"],
    itineraryDays: [
      { dayNumber: 1, title: "Camp Setup & Barbecue", description: "Arrive, set up jungle camp near the cowsheds, evening barbecue dinner under the stars." },
    ],
    featured: false,
  },
  {
    slug: "agro-tourist-package",
    tier: "LOCAL",
    name: "Agro Tourist Package",
    summary: "Stay in a village farmer's home, eat organic food, and take part in hands-on agriculture and cultural exchange.",
    durationLabel: "Flexible, priced per day",
    price: { amount: 1000, currency: "NPR", unit: "per person / day", confirmed: true },
    guaranteeNoSighting: false,
    inclusions: ["Farmer homestay lodging", "Organic food", "Hands-on agriculture activities", "Cultural exchange"],
    heroImage: "/placeholders/hero-agro.svg",
    galleryImages: ["/placeholders/gallery-village.svg"],
    itineraryDays: [
      { dayNumber: 1, title: "Farm Life Immersion", description: "Join daily farm chores, share organic meals, and exchange stories with the host family." },
    ],
    featured: true,
  },
  {
    slug: "tumling-sightseeing",
    tier: "LOCAL",
    name: "Tumling Sightseeing",
    summary: "Land Rover + guide day trip covering Tumling Ram Mandir, Singhalila National Park, and Kanchenjunga views.",
    durationLabel: "1 day, for 6 persons",
    price: { amount: 3000, currency: "NPR", unit: "per 6 persons", confirmed: true },
    guaranteeNoSighting: false,
    inclusions: [
      "Land Rover + guide",
      "Tumling Ram Mandir",
      "Singhalila National Park birding & Kanchenjunga view from Stupa View Point",
      "Gurashe Sherpa cultural & water monastery",
      "Devi Cave",
      "Gufadada (rolling clouds, spongy grass walk)",
      "Tumling Fatak (Kanchenjunga + Everest view)",
    ],
    heroImage: "/placeholders/hero-sightseeing.svg",
    galleryImages: ["/placeholders/gallery-landrover.svg", "/placeholders/gallery-mountain.svg"],
    itineraryDays: [
      { dayNumber: 1, title: "Full-Day Sightseeing Loop", description: "Land Rover circuit through Tumling Ram Mandir, Singhalila National Park, Gurashe Sherpa monastery, Devi Cave, Gufadada, and Tumling Fatak." },
    ],
    featured: false,
  },
  {
    slug: "double-mazza-package",
    tier: "LOCAL",
    name: "Double Mazza Package",
    summary: "Everything in the Tumling Sightseeing trip, plus Meghma Monastery, Tonglu Lake, and Jaubari heritage village.",
    durationLabel: "For 6 persons",
    price: {
      amount: null,
      currency: "NPR",
      unit: "per 6 persons",
      confirmed: false,
      displayOverride: "Rs. 3,000 or Rs. 7,000 / 6 persons — confirm which tier applies with owner",
    },
    guaranteeNoSighting: false,
    inclusions: [
      "Everything in Tumling Sightseeing",
      "Meghma Monastery",
      "Tonglu Lake",
      "Jaubari heritage village (agricultural farming, Nepal)",
    ],
    heroImage: "/placeholders/hero-sightseeing.svg",
    galleryImages: ["/placeholders/gallery-mountain.svg", "/placeholders/gallery-village.svg"],
    itineraryDays: [
      { dayNumber: 1, title: "Extended Sightseeing Loop", description: "Full Tumling Sightseeing route plus Meghma Monastery, Tonglu Lake, and Jaubari heritage village." },
    ],
    featured: false,
  },
];

export function getPackageBySlug(slug: string): PackageData | undefined {
  return packages.find((p) => p.slug === slug);
}

export function getFeaturedPackages(): PackageData[] {
  return packages.filter((p) => p.featured);
}

export function getPackagesByTier(tier: PackageTier): PackageData[] {
  return packages.filter((p) => p.tier === tier);
}
