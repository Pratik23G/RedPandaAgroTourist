import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl font-bold text-forest-800">Page Not Found</h1>
      <p className="mt-2 text-forest-700/80">
        The page you&apos;re looking for doesn&apos;t exist. Try our packages or head back home.
      </p>
      <div className="mt-6 flex gap-4">
        <Link href="/" className="tap-target rounded-lg bg-rust-500 px-6 font-semibold text-cream-50 hover:bg-rust-600">
          Home
        </Link>
        <Link href="/packages" className="tap-target rounded-lg border border-forest-700/30 px-6 text-forest-700">
          Packages
        </Link>
      </div>
    </div>
  );
}
