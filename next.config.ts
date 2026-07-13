import type { NextConfig } from "next";

// Baseline security headers (OWASP secure-headers baseline). CSP is intentionally
// deferred to Phase 5 once real third-party origins (Resend, Turnstile, analytics,
// maps) are finalized — a wrong CSP here would silently break those integrations.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Placeholder art (public/placeholders/*.svg) is served through next/image.
    // SVG is blocked by default because arbitrary/user-uploaded SVGs can carry
    // <script>. These are our own static, script-free, checked-in files, so we
    // allow SVG using Next's documented safe pattern: force download
    // disposition + a locked-down CSP scoped to the image response only (no
    // scripts, sandboxed). Real photos (JPEG/AVIF/WebP) replace these before
    // launch; this can be removed once no *.svg remain in public/placeholders.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
