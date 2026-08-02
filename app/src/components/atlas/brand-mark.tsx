import { useId } from "react";

export function BrandGlyph({ className = "" }: { className?: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg className={`brand-glyph ${className}`} viewBox="0 0 28 28" role="presentation">
      <defs>
        <linearGradient id={`${id}-red-blue`} gradientUnits="userSpaceOnUse" x1="14" y1="5" x2="23" y2="21">
          <stop offset="0" stopColor="#f0525f" />
          <stop offset="0.62" stopColor="#f0525f" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={`${id}-blue-green`} gradientUnits="userSpaceOnUse" x1="23" y1="21" x2="5" y2="21">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.62" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#20b96b" />
        </linearGradient>
        <linearGradient id={`${id}-green-red`} gradientUnits="userSpaceOnUse" x1="5" y1="21" x2="14" y2="5">
          <stop offset="0" stopColor="#20b96b" />
          <stop offset="0.62" stopColor="#20b96b" />
          <stop offset="1" stopColor="#f0525f" />
        </linearGradient>
      </defs>
      <path className="brand-edge" d="M14 5 23 21H5Z" />
      <path className="brand-energy-segment brand-energy-red" pathLength="100" d="M14 5 23 21" stroke={`url(#${id}-red-blue)`} />
      <path className="brand-energy-segment brand-energy-blue" pathLength="100" d="M23 21H5" stroke={`url(#${id}-blue-green)`} />
      <path className="brand-energy-segment brand-energy-green" pathLength="100" d="M5 21 14 5" stroke={`url(#${id}-green-red)`} />
      <circle className="brand-node brand-node-red" cx="14" cy="5" r="2.6" />
      <circle className="brand-node brand-node-blue" cx="23" cy="21" r="2.6" />
      <circle className="brand-node brand-node-green" cx="5" cy="21" r="2.6" />
    </svg>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark-compact" : ""}`} aria-hidden="true">
      <BrandGlyph />
    </div>
  );
}
