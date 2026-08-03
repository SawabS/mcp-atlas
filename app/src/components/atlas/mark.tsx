import { useId } from "react";

/**
 * Atlas mark: a slow orbit around a bright protocol core.
 * Three nodes = host, client, server.
 */
export function Mark({ className = "", spin = true }: { className?: string; spin?: boolean }) {
  const raw = useId();
  const id = `mk${raw.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg className={`mark ${className}`} viewBox="0 0 32 32" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-a`} x1="5" y1="3" x2="27" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8e7bff" />
          <stop offset="0.52" stopColor="#55e0d5" />
          <stop offset="1" stopColor="#ff8cae" />
        </linearGradient>
        <radialGradient id={`${id}-b`} cx="0.4" cy="0.34" r="0.75">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#8e7bff" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      <g className={spin ? "mark-ring" : undefined}>
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke={`url(#${id}-a)`}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeDasharray="30 13"
          opacity="0.95"
        />
      </g>

      <circle cx="16" cy="16" r="7.4" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.22" />

      <circle cx="16" cy="4" r="2.5" fill="#8e7bff" />
      <circle cx="26.4" cy="22" r="2.5" fill="#55e0d5" />
      <circle cx="5.6" cy="22" r="2.5" fill="#ff8cae" />

      <circle cx="16" cy="16" r="3.6" fill={`url(#${id}-b)`} />
    </svg>
  );
}
