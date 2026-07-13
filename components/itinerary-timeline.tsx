import type { ItineraryDay } from "@/lib/data/packages";
import { PawPrint } from "@/components/paw-print";

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  return (
    <ol className="relative border-l-2 border-dashed border-forest-700/25 pl-7">
      {days.map((day, i) => (
        <li key={day.dayNumber} className="group mb-9 last:mb-0">
          <span
            className="animate-float absolute -left-[1.15rem] flex h-8 w-8 items-center justify-center rounded-full bg-rust-500 text-cream-50 shadow-sm"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <PawPrint className="h-4 w-4" />
          </span>
          <span className="eyebrow text-rust-500">Day {day.dayNumber}</span>
          <h3 className="mt-1 font-display text-lg text-forest-900">{day.title}</h3>
          <p className="mt-1 text-forest-700/80">{day.description}</p>
        </li>
      ))}
    </ol>
  );
}
