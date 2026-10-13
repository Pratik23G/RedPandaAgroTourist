"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setDisplayCurrency } from "@/lib/display-currency";
import { DISPLAY_CURRENCIES, type DisplayCurrency } from "@/lib/currency";

export function CurrencySelector({ current, stacked = false }: { current: DisplayCurrency; stacked?: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <label className={stacked ? "flex flex-col gap-1 text-sm" : "flex items-center gap-2 text-sm"}>
      <span className={stacked ? "text-forest-700" : "hidden whitespace-nowrap text-forest-700 2xl:inline"}>Prices in:</span>
      <select
        defaultValue={current}
        disabled={pending}
        aria-label="Choose the currency prices are shown in"
        className={`tap-target rounded-lg border border-forest-700/30 bg-cream-50 px-3 font-semibold text-forest-800 ${stacked ? "w-full justify-start" : ""}`}
        onChange={(e) => {
          const c = e.target.value as DisplayCurrency;
          start(async () => {
            await setDisplayCurrency(c);
            router.refresh();
          });
        }}
      >
        {DISPLAY_CURRENCIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </label>
  );
}
