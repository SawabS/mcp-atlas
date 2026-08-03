# React Bits UI/UX audit

Audit date: 2026-08-03

Sources: [React Bits MCP guide](https://reactbits.dev/get-started/mcp), [component index](https://reactbits.dev/get-started/index), [official registry](https://reactbits.dev/r/registry.json), and [shadcn MCP documentation](https://ui.shadcn.com/docs/mcp).

## What the MCP actually is

React Bits deliberately uses the shadcn MCP server rather than shipping a separate MCP binary. This project exposes its registry under the `@react-bits` namespace in `app/components.json`:

```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

The registry currently contains 556 installable entries: 139 unique components, normally offered as JavaScript/TypeScript and CSS/Tailwind variants. The public site describes the collection as 140+ components, so the precise count can move as the registry changes.

Codex is connected to the shadcn MCP server through the user configuration (restart Codex after changing this file):

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

## Complete registry overview

### Text animations — 23

SplitText, BlurText, CircularText, TextType, Shuffle, ShinyText, TextPressure, CurvedLoop, FuzzyText, GradientText, FallingText, TextCursor, DecryptedText, TrueFocus, ScrollFloat, ScrollReveal, ASCIIText, ScrambledText, RotatingText, GlitchText, ScrollVelocity, VariableProximity, CountUp.

Best Atlas opportunities: a one-time SplitText or BlurText hero entrance, CountUp for the four corpus metrics, DecryptedText for a pinned commit, and restrained GradientText for one editorial phrase. Avoid simultaneous text effects in documentation content; legibility and selectable text take priority.

### Animations — 31

CursorGrid, AnimatedContent, FadeContent, ElectricBorder, OrbitImages, PixelTransition, GlareHover, Antigravity, LogoLoop, TargetCursor, MagicRings, LaserFlow, MagnetLines, GhostCursor, GradualBlur, ClickSpark, Magnet, Strands, StickerPeel, PixelTrail, Cubes, MetallicPaint, Noise, ShapeBlur, Crosshair, ImageTrail, Ribbons, SplashCursor, MetaBalls, BlobCursor, StarBorder.

Best Atlas opportunities: GlareHover for the four primary category cards, StarBorder for one primary CTA, LogoLoop for an SDK-language strip, and a single FadeContent/AnimatedContent boundary around a major section. The app already has a thematic cursor and protocol orbit, so GhostCursor, BlobCursor, TargetCursor, Crosshair, OrbitImages, and MagicRings would duplicate established interactions.

### Components — 40

SpecularButton, OptionWheel, CurvedInput, LineSidebar, AnimatedList, ScrollStack, BubbleMenu, MagicBento, CircularGallery, ReflectiveCard, CardNav, Stack, FluidGlass, PillNav, TiltedCard, Masonry, GlassSurface, DomeGallery, ChromaGrid, Folder, StaggeredMenu, ModelViewer, Lanyard, ProfileCard, Dock, GooeyNav, PixelCard, Carousel, SpotlightCard, BorderGlow, FlyingPosters, CardSwap, GlassIcons, DecayCard, FlowingMenu, ElasticSlider, Counter, InfiniteMenu, Stepper, BounceCards.

Best Atlas opportunities: AnimatedList for a short search result set, ChromaGrid or MagicBento for a curated landing-page collection, Folder for grouped SDK resources, and Stepper for build-server/client tutorials. The existing rail, pills, search, and reader already cover CardNav, Dock, PillNav, CurvedInput, and LineSidebar. Masonry is a poor fit for dense reference cards because stable rows scan faster.

### Backgrounds — 45

Ferrofluid, Lightfall, LiquidEther, Prism, DarkVeil, LightPillar, Silk, FloatingLines, SideRays, LightRays, PixelBlast, ColorBends, EvilEye, LineWaves, Radar, SoftAurora, Aurora, Plasma, PlasmaWave, Particles, GradientBlinds, Grainient, GridScan, Beams, PixelSnow, Lightning, PrismaticBurst, Galaxy, Dither, FaultyTerminal, RippleGrid, DotField, DotGrid, Threads, Hyperspeed, Iridescence, Waves, GridDistortion, Ballpit, Orb, LetterGlitch, GridMotion, ShapeGrid, LiquidChrome, Balatro.

Best Atlas opportunities: at most one lazy-loaded atmospheric background, with a static fallback and automatic suspension for reduced motion and hidden tabs. SoftAurora, Aurora, Threads, or DotGrid align with the product language. The adopted SoftAurora is blended into the existing sky at very low opacity instead of competing with the orbit or constellation.

## Adoption matrix for MCP Atlas

| Tier | Components | Recommended use | Guardrail |
| --- | --- | --- | --- |
| Adopted | GlareHover | Four overview entry cards | CSS-only and hover-triggered; no pointer geometry reads |
| Adopted | StarBorder | Primary “Explore the library” CTA | One instance; disabled for reduced motion |
| Adopted | DecryptedText | Four overview card titles | Hover-only; Motion dependency removed from the imported source |
| Adopted | SoftAurora | Fixed atmospheric sky | Adapted to CSS transforms; no WebGL loop or runtime dependency |
| Existing equivalent | CountUp | Corpus totals | Current local implementation only runs while values settle and is lighter than adding Motion |
| Existing equivalent | Target/Ghost cursor | Shooting-star ball, tail, and glitter | Keep one passive global listener and one cursor system |
| Existing equivalent | OrbitImages/MagicRings | Protocol orbit | Keep the semantic Tools/Resources/Prompts orbit |
| Next, low risk | LogoLoop | SDK languages and supported transports | Pause off-screen and on hover; use text/SVG assets only |
| Next, scoped | AnimatedList | Spotlight’s top results | Cap the animated list and lazy-load its motion dependency |
| Next, scoped | Folder | Group SDK guides/examples by language | Use as progressive enhancement, with semantic links beneath |
| Conditional | ChromaGrid or MagicBento | A curated “popular paths” section | Never use for all 1,114 documents |
| Conditional | Threads/DotGrid | Alternate atmospheric skin | Replace SoftAurora rather than stacking another canvas |
| Reject for repeated cards | SpotlightCard, Magnet, BorderGlow | Pointer-following card effects | Per-instance geometry reads/listeners recreate the lag just removed |
| Reject globally | ClickSpark, PixelCard, canvas trails | Decorative interaction | Continuous RAF/canvas work is disproportionate to navigation value |
| Reject here | GlassSurface, FluidGlass | Dense library and registry grids | Repeated backdrop filters are expensive to repaint |
| Reject here | SpecularButton | Primary controls | Adds OGL/WebGL for a button effect that CSS already covers |

## Performance changes made in this pass

- Removed per-card pointer tracking and its `getBoundingClientRect()` read plus CSS-variable writes on every pointer move.
- Replaced per-card `IntersectionObserver` instances with deterministic CSS entrance animations; dense grids no longer allocate observers.
- Removed repeated `backdrop-filter` from document and registry cards.
- Limited hover motion to composited `transform`, with shorter timing and no animated shadow.
- Added `content-visibility: auto` and intrinsic sizing to long card grids so off-screen cards can skip rendering work.
- Added reduced-motion behavior for Atlas and imported React Bits effects.
- Kept React Bits effects concentrated on the page atmosphere and four overview cards rather than multiplying them across 36–48 result cards.
- Adapted SoftAurora to composited CSS fog bands, eliminating its WebGL loop and `ogl` dependency while preserving a static reduced-motion frame.
- Adapted DecryptedText to use native React spans, avoiding an otherwise unnecessary Motion runtime.

## MCP prompts for future passes

```text
List all @react-bits text animations and identify which do not require Motion or GSAP.
Show the @react-bits LogoLoop TypeScript CSS variant and its dependencies.
Add @react-bits/DecryptedText-TS-CSS, then adapt it to animate only on keyboard focus or hover.
Compare @react-bits/SoftAurora-TS-CSS and @react-bits/Threads-TS-CSS for bundle size and runtime cost before installing either.
```

Prefer dependency and source inspection before `add`. The most dramatic React Bits demo is not automatically the best production component, especially when a grid repeats it dozens of times.
