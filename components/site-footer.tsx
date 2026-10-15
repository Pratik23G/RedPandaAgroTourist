import Image from "next/image";
import Link from "next/link";
import { OFFICES } from "@/components/whatsapp-cta";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-forest-900 text-cream-100">
      <div className="ridge-divider text-cream-100" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-8">
        <div>
          <Image src="/images/logo.png" alt="Red Panda Agro Tourist Tours & Travel Pvt. Ltd. logo" width={96} height={96} className="h-24 w-24" />
          <h2 className="mt-3 font-display text-lg font-bold text-cream-50">Red Panda Agro Tourist</h2>
          <p className="mt-2 text-sm text-cream-100/70">
            Eco- and agro-tourism in the Tumling / Singhalila region, Eastern Himalayas.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-cream-50">Offices</h3>
          <ul className="mt-2 space-y-1 text-sm text-cream-100/80">
            <li>{OFFICES.tumling.label}: <a href={`tel:+${OFFICES.tumling.phone}`} className="inline-flex min-h-[44px] items-center hover:text-rust-400">+91 7063727464</a></li>
            <li>{OFFICES.kathmandu.label}: <a href={`tel:+${OFFICES.kathmandu.phone}`} className="inline-flex min-h-[44px] items-center hover:text-rust-400">+977 9823808506</a></li>
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
      <p className="mx-auto max-w-4xl px-4 pb-3 text-center text-xs leading-relaxed text-cream-100/60">
        Hero scenery footage from Wikimedia Commons: &ldquo;Khanchendzonga from Jorebunglow, Darjeeling&rdquo; (CC BY-SA 4.0);
        &ldquo;Into the mist, above the clouds towards Kaffer, Kalimpong from Siliguri&rdquo; (CC BY-SA 4.0);
        &ldquo;The Himalayan&rdquo; by Amit Haware (CC BY 3.0). Cropped and edited.
      </p>
      <div className="border-t border-cream-100/10 px-4 py-4 text-center text-xs text-cream-100/60">
        © {new Date().getFullYear()} Red Panda Agro Tourist Tours & Travel Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}
