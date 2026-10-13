"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setVisitorOrigin, type VisitorOrigin } from "@/lib/origin-cookie";

const OPTIONS: { value: VisitorOrigin; label: string }[] = [
  { value: "nepal", label: "Nepal" },
  { value: "saarc", label: "India / Bangladesh / Pakistan" },
  { value: "other", label: "Other countries" },
];

export function OriginSelector({ initialOrigin, stacked = false }: { initialOrigin: VisitorOrigin; stacked?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <label className={stacked ? "flex flex-col gap-1 text-sm" : "flex items-center gap-2 text-sm"}>
      <span className="whitespace-nowrap text-forest-700">I&apos;m visiting from:</span>
      <select
        defaultValue={initialOrigin}
        disabled={isPending}
        aria-label="Select your visitor origin to see relevant package pricing"
        className={`tap-target rounded-lg border border-forest-700/30 bg-cream-50 px-3 text-forest-800 ${stacked ? "w-full justify-start" : ""}`}
        onChange={(e) => {
          const value = e.target.value as VisitorOrigin;
          startTransition(async () => {
            await setVisitorOrigin(value);
            router.refresh();
          });
        }}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
