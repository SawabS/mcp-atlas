import { useId } from "react";

/**
 * Index mark: three protocol nodes (host, client, server) joined by a fixed
 * link ring. The ring never moves. A pulse of light travels along it and flares
 * each node as it arrives, so the energy is what animates, not the link.
 *
 * The pulse head starts on the top node and sweeps clockwise, so the nodes are
 * lit at 0, a third and two thirds of the cycle.
 */
const CYCLE = 5.4;

const nodes = [
  { cx: 16, cy: 4, hue: "#8e7bff", delay: 0 },
  { cx: 26.39, cy: 22, hue: "#55e0d5", delay: CYCLE / 3 },
  { cx: 5.61, cy: 22, hue: "#ff8cae", delay: (CYCLE * 2) / 3 },
];

export function Mark({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  const raw = useId();
  const id = `mk${raw.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      className={`mark ${animated ? "is-live" : ""} ${className}`.trim()}
      viewBox="0 0 32 32"
      role="presentation"
      aria-hidden="true"
      style={{ "--cycle": `${CYCLE}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id={`${id}-link`} x1="5" y1="3" x2="27" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8e7bff" />
          <stop offset="0.52" stopColor="#55e0d5" />
          <stop offset="1" stopColor="#ff8cae" />
        </linearGradient>

        {/* Fades along the trailing arc so the pulse reads as a comet of light. */}
        <linearGradient id={`${id}-flow`} x1="6.54" y1="8.61" x2="16" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#55e0d5" stopOpacity="0" />
          <stop offset="0.55" stopColor="#55e0d5" stopOpacity="0.5" />
          <stop offset="1" stopColor="#8ff6ee" stopOpacity="1" />
        </linearGradient>

        <radialGradient id={`${id}-head`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#8ff6ee" />
          <stop offset="1" stopColor="#55e0d5" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`${id}-core`} cx="0.4" cy="0.34" r="0.78">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.94" />
          <stop offset="0.42" stopColor="#a08cff" />
          <stop offset="1" stopColor="#5b45c8" />
        </radialGradient>
      </defs>

      {/* The links: a fixed ring through all three nodes. */}
      <circle cx="16" cy="16" r="12" fill="none" stroke={`url(#${id}-link)`} strokeWidth="1.15" opacity="0.42" />
      <circle cx="16" cy="16" r="7.4" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.2" />

      {/* The travelling pulse. Only this group rotates. */}
      <g className="mark-pulse">
        <path
          d="M6.54 8.61A12 12 0 0 1 16 4"
          fill="none"
          stroke={`url(#${id}-flow)`}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="16" cy="4" r="3" fill={`url(#${id}-head)`} opacity="0.85" />
        <circle cx="16" cy="4" r="1.15" fill="#ffffff" />
      </g>

      {nodes.map((node) => (
        <g className="mark-node" key={node.hue} style={{ "--delay": `${node.delay}s` } as React.CSSProperties}>
          <circle className="mark-node-flare" cx={node.cx} cy={node.cy} r="2.5" fill={node.hue} />
          <circle className="mark-node-core" cx={node.cx} cy={node.cy} r="2.5" fill={node.hue} />
        </g>
      ))}

      <circle cx="16" cy="16" r="3" fill={`url(#${id}-core)`} />
    </svg>
  );
}
