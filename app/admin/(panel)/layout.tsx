import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  ["/admin", "Dashboard"],
  ["/admin/analytics", "Funnel"],
  ["/admin/inquiries", "Inquiries"],
  ["/admin/invoices", "Invoices"],
  ["/admin/emails", "Emails"],
] as const;

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <nav className="flex flex-wrap items-center gap-1 border-b border-forest-700/15 pb-3 text-sm">
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} className="tap-target rounded-sm px-3 font-medium text-forest-800 hover:bg-forest-700/10">{label}</Link>
        ))}
        <form action={logout} className="ml-auto">
          <button className="tap-target px-3 text-forest-700/70 hover:text-rust-600">Sign out</button>
        </form>
      </nav>
      <div className="pt-8">{children}</div>
    </div>
  );
}
