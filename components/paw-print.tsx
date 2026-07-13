export function PawPrint({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <ellipse cx="16" cy="21" rx="9" ry="7.5" />
      <ellipse cx="6" cy="12" rx="3.4" ry="4.2" transform="rotate(-18 6 12)" />
      <ellipse cx="13.5" cy="6.5" rx="3.4" ry="4.4" transform="rotate(-6 13.5 6.5)" />
      <ellipse cx="20.5" cy="6.5" rx="3.4" ry="4.4" transform="rotate(6 20.5 6.5)" />
      <ellipse cx="27" cy="12.5" rx="3.4" ry="4.2" transform="rotate(18 27 12.5)" />
    </svg>
  );
}
