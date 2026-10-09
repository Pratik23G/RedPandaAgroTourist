"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block text-sm font-medium text-forest-800">
        Password
        <input name="password" type="password" required autoFocus autoComplete="current-password" className="tap-target mt-1 w-full rounded-lg border border-forest-700/30 bg-white px-3" />
      </label>
      {state.error && <p role="alert" className="text-sm text-rust-600">{state.error}</p>}
      <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
