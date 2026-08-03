import type { CSSProperties } from "react";

import "./SoftAurora.css";

type SoftAuroraProps = {
  color1?: string;
  color2?: string;
  speed?: number;
  brightness?: number;
};

/**
 * A CSS-only adaptation of React Bits' SoftAurora composition. Diffused bands
 * move on compositor-friendly transforms, without a permanent canvas loop.
 */
export default function SoftAurora({
  color1 = "#8b7cff",
  color2 = "#65ddd6",
  speed = 1,
  brightness = 1,
}: SoftAuroraProps) {
  const style = {
    "--soft-aurora-a": color1,
    "--soft-aurora-b": color2,
    "--soft-aurora-speed": `${Math.max(0.1, speed)}`,
    "--soft-aurora-brightness": brightness,
  } as CSSProperties;

  return (
    <div className="soft-aurora-container" style={style}>
      <i />
      <i />
      <i />
    </div>
  );
}
