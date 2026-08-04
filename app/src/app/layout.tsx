import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import "./mcp-index.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const editorial = Instrument_Serif({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MCP Index: the Model Context Protocol, indexed",
    template: "%s | MCP Index",
  },
  description:
    "A source-linked index for the Model Context Protocol: specification, SDKs, reference servers, the Registry, and a grounded guide that cites exact commits.",
  applicationName: "MCP Index",
  keywords: ["Model Context Protocol", "MCP", "knowledge base", "SDK", "Registry", "specification"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06070e" },
    { media: "(prefers-color-scheme: light)", color: "#f5f4f1" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${editorial.variable} ${mono.variable} dark`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script id="index-theme" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("mcp-index-theme-v1");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}var r=document.documentElement;r.dataset.theme=t;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t}catch(e){}})()`}
        </Script>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
