import Image from "next/image";

/**
 * Provider logos for the model picker.
 *
 * The artwork is normalised to 128px square icons in `public/providers`. The
 * Moonshot and Z.ai marks are white on transparent, so every logo is set on the
 * same dark tile rather than inverting some of them per theme.
 */

export type Provider = "nvidia" | "moonshot" | "deepseek" | "zai";

export const providerName: Record<Provider, string> = {
  nvidia: "NVIDIA",
  moonshot: "Moonshot AI",
  deepseek: "DeepSeek",
  zai: "Z.ai",
};

const artwork: Record<Provider, string> = {
  nvidia: "/providers/nvidia.webp",
  moonshot: "/providers/moonshot.webp",
  deepseek: "/providers/deepseek.webp",
  zai: "/providers/zai.webp",
};

export function ProviderMark({ provider, size = 18 }: { provider: Provider; size?: number }) {
  return (
    <span className="provider-mark" style={{ width: size, height: size }}>
      <Image src={artwork[provider]} alt="" width={128} height={128} priority />
    </span>
  );
}
