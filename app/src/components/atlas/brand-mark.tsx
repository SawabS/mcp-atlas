export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark-compact" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 28 28" role="presentation">
        <path className="brand-edge" d="M6 20 14 6l8 14Z" />
        <path className="brand-flow" d="M6 20 14 6l8 14Z" />
        <circle className="brand-node" cx="6" cy="20" r="3" />
        <circle className="brand-node brand-node-live" cx="14" cy="6" r="3" />
        <circle className="brand-node" cx="22" cy="20" r="3" />
      </svg>
    </div>
  );
}
