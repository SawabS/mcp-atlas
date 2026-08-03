import SoftAurora from "@/components/SoftAurora";

/** Fixed atmospheric backdrop: drifting aurora, hairline mesh, film grain. */
export function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky-soft-aurora">
        <SoftAurora
          speed={0.62}
          brightness={0.72}
          color1="#8b7cff"
          color2="#65ddd6"
        />
      </div>
      <div className="sky-veil">
        <i />
        <i />
        <i />
      </div>
      <div className="sky-mesh" />
      <div className="sky-floor" />
      <div className="sky-grain" />
    </div>
  );
}
