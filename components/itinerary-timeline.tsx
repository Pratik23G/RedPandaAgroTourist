import type { ItineraryDay } from "@/lib/data/packages";

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  return (
    <ol className="relative border-l border-forest-700/20 pl-6">
      {days.map((day) => (
        <li key={day.dayNumber} className="mb-8 last:mb-0">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-rust-500 text-xs font-bold text-cream-50">
            {day.dayNumber}
          </span>
          <h3 className="font-display text-base text-forest-800">
            Day {day.dayNumber}: {day.title}
          </h3>
          <p className="mt-1 text-sm text-forest-700/80">{day.description}</p>
        </li>
      ))}
    </ol>
  );
}
