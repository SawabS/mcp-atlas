import dynamic from "next/dynamic";

const SoftAurora = dynamic(() => import("@/components/SoftAurora"), { ssr: false });

/** Fixed atmospheric backdrop: drifting aurora, hairline mesh, film grain. */
export function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky-soft-aurora">
        <SoftAurora
          speed={0.18}
          scale={1.85}
          brightness={0.72}
          color1="#8b7cff"
          color2="#65ddd6"
          noiseFrequency={1.45}
          noiseAmplitude={0.72}
          bandHeight={0.46}
          bandSpread={0.62}
          octaveDecay={0.22}
          layerOffset={1.8}
          colorSpeed={0.24}
          enableMouseInteraction={false}
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
