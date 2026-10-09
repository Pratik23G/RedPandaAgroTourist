"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setDisplayCurrency } from "@/lib/display-currency";
import { DISPLAY_CURRENCIES, type DisplayCurrency } from "@/lib/currency";

export function CurrencySelector({ current }: { current: DisplayCurrency }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="whitespace-nowrap text-forest-700">Prices in:</span>
      <select
        defaultValue={current}
        disabled={pending}
        aria-label="Choose the currency prices are shown in"
        className="tap-target rounded-lg border border-forest-700/30 bg-cream-50 px-3 font-semibold text-forest-800"
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
