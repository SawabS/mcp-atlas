export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark-compact" : ""}`} aria-hidden="true">
      <span className="brand-orbit brand-orbit-one" />
      <span className="brand-orbit brand-orbit-two" />
      <span className="brand-glyph">A</span>
      <span className="brand-satellite" />
    </div>
  );
}
