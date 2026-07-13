import { cn } from "@/lib/utils";

/** Traditional Tibetan Buddhist bunting order (blue/white/red/green/yellow), tuned to our palette. */
const FLAG_COLORS = ["#3B6EA5", "#F5F0E6", "#B23A2E", "#3A5C48", "#D9A62E"];
const FLAG_COUNT = 24;

/** Decorative garland evoking the flag lines strung at Himalayan viewpoints along this route. Purely visual. */
export function PrayerFlags({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none relative h-9 w-full select-none overflow-hidden", className)} aria-hidden>
      <div className="absolute inset-x-0 top-1 h-px bg-current opacity-40" />
      <div className="flex h-full items-start justify-between px-[2%] pt-1">
        {Array.from({ length: FLAG_COUNT }).map((_, i) => (
          <span
            key={i}
            className="animate-flag-sway block h-6 w-3 origin-top rounded-b-sm shrink-0"
            style={{
              backgroundColor: FLAG_COLORS[i % FLAG_COLORS.length],
              animationDelay: `${(i % 6) * 0.13}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
