import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Sans_Devanagari } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Red Panda Agro Tourist | Red Panda Tracking & Homestays, Eastern Himalayas",
    template: "%s | Red Panda Agro Tourist",
  },
  description:
    "Guided red panda tracking, bird watching, cultural village tours, and farm-family homestays in Tumling / Singhalila, Eastern Himalayas. No sighting, no charge.",
  openGraph: {
    type: "website",
    siteName: "Red Panda Agro Tourist",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${notoDevanagari.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
