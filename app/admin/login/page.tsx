import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-3xl font-bold text-forest-800">Admin</h1>
      <p className="mt-1 text-sm text-forest-700/70">Red Panda Agro Tourist — invoices &amp; payments</p>
      <LoginForm />
    </div>
  );
}
