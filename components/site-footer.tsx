import Link from "next/link";
import { OFFICES } from "@/components/whatsapp-cta";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-forest-900 text-cream-100">
      <div className="ridge-divider text-cream-100" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-8">
        <div>
          <h2 className="font-display text-lg font-bold text-cream-50">Red Panda Agro Tourist</h2>
          <p className="mt-2 text-sm text-cream-100/70">
            Eco- and agro-tourism in the Tumling / Singhalila region, Eastern Himalayas.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-cream-50">Offices</h3>
          <ul className="mt-2 space-y-1 text-sm text-cream-100/80">
            <li>{OFFICES.tumling.label}: +91 7063727464</li>
            <li>{OFFICES.kathmandu.label}: +977 9823808506</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-cream-50">Company</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/privacy" className="tap-target text-cream-100/80 hover:text-rust-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="tap-target text-cream-100/80 hover:text-rust-400">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-100/10 px-4 py-4 text-center text-xs text-cream-100/60">
        © {new Date().getFullYear()} Red Panda Agro Tourist Tours & Travel Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}
