"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { VisitorOrigin } from "@/lib/origin-cookie";
import type { DisplayCurrency } from "@/lib/currency";
import { setVisitorRegion, type VisitorRegion } from "@/lib/display-currency";

const OPTIONS: { value: VisitorRegion; label: string }[] = [
  { value: "nepal", label: "Nepal" },
  { value: "india", label: "India" },
  { value: "bangladesh", label: "Bangladesh" },
  { value: "pakistan", label: "Pakistan" },
  { value: "other", label: "Other countries" },
];

function toRegion(origin: VisitorOrigin, currency: DisplayCurrency): VisitorRegion {
  if (origin === "nepal") return "nepal";
  if (origin === "saarc") return currency === "BDT" ? "bangladesh" : currency === "PKR" ? "pakistan" : "india";
  return "other";
}

export function OriginSelector({
  initialOrigin,
  currency,
  stacked = false,
}: {
  initialOrigin: VisitorOrigin;
  currency: DisplayCurrency;
  stacked?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const region = toRegion(initialOrigin, currency);

  return (
    <label className={stacked ? "flex flex-col gap-1 text-sm" : "flex items-center gap-2 text-sm"}>
      <span className={stacked ? "text-forest-700" : "hidden whitespace-nowrap text-forest-700 2xl:inline"}>I&apos;m visiting from:</span>
      <select
        key={region}
        defaultValue={region}
        disabled={isPending}
        aria-label="Select your visitor origin to see relevant package pricing"
        className={`tap-target rounded-lg border border-forest-700/30 bg-cream-50 px-3 text-forest-800 ${stacked ? "w-full justify-start" : "max-w-[12rem]"}`}
        onChange={(e) => {
          const value = e.target.value as VisitorRegion;
          startTransition(async () => {
            await setVisitorRegion(value);
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
