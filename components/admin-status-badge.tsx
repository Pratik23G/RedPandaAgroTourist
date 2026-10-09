import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  DRAFT: "bg-forest-700/10 text-forest-800",
  SENT: "bg-gold-400/30 text-forest-900",
  PARTIALLY_PAID: "bg-rust-400/30 text-rust-700",
  PAID: "bg-forest-600 text-cream-50",
  VOID: "bg-forest-900/10 text-forest-700/60 line-through",
  PENDING: "bg-gold-400/30 text-forest-900",
  CONFIRMED: "bg-forest-600 text-cream-50",
  REJECTED: "bg-rust-500/20 text-rust-700",
  FAILED: "bg-rust-500/20 text-rust-700",
  SKIPPED: "bg-gold-400/30 text-forest-900",
  LOGGED: "bg-forest-700/10 text-forest-800",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return <span className={cn("inline-block rounded-sm px-2 py-0.5 text-xs font-semibold", STYLES[status] ?? STYLES.DRAFT)}>{(label ?? status).replace("_", " ")}</span>;
}
