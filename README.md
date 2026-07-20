# Toyota Bangladesh — flagship site demo

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Motion · Lenis · Zustand.
Built to `PLAN.md`. No backend — all content is mock data in `lib/data/`.

```bash
npm run dev     # http://localhost:3000
npm run build   # static-capable production build
```

## Routes

| Route | Rendering | Notes |
|---|---|---|
| `/` | Static | Hero → Vehicles → Technology → Safety → Offers → Dealers → Test Drive |
| `/vehicles/[slug]` | SSG, 8 paths | One template; RAV4 swaps its gallery for the 360° viewer |
| `/service` | Dynamic (reads `?tab=`) | `?tab=shop` (default) or `?tab=book` |

Unknown vehicle slugs 404 — `dynamicParams` is off.

## Asset contract

**Paths are stable.** Dropping real files at these paths needs no code changes.

| Path | Status | Used by |
|---|---|---|
| `public/logos/*.png` | **Real** — official brand files | Nav, footer |
| `public/rav4/360/001–036.webp` | **Real** — 36 renders, silver | RAV4 360° viewer |
| `public/rav4/colors/{silver,grey,blue,white}.webp` | **Real** | Home hero, RAV4 hero/gallery/swatches |
| `public/vehicles/{slug}.webp` | **Placeholder** — grey silhouettes | Cards, mega-menu, detail heroes |
| `public/parts/{id}.webp` | **Placeholder** — grey icons | Product grid, drawer, cart |
| `public/tech/{hybrid,safety-sense,connected}.webp` | **Placeholder** — grey circles | Technology cards, feature rows |

Replacing placeholders:

- **Vehicles** — `public/vehicles/{slug}.webp`, matching a `slug` in `lib/data/vehicles.ts`. Wide crop (16:10 or better). Renders matted on **white** work best; they're composited with `mix-blend-multiply` onto the tinted well, so a white matte disappears and a coloured one will not.
- **Parts** — `public/parts/{id}.webp`, square, matching a product `id` in `lib/data/products.ts`.
- **Per-colour shots** — add `image` to a `VehicleColor` in `vehicles.ts`. `ColorSelector` becomes interactive automatically; without `image`, swatches render as a non-interactive paint list rather than showing the wrong car under a colour name.

## Content scope

Eight models, limited to those with usable imagery: RAV4, Corolla Cross,
Corolla Altis, Camry, Fortuner, Hilux, Land Cruiser, Rush. `PLAN.md` §3.3 lists
fourteen; Yaris, Prado, Hiace, Raize, Prius and C-HR are omitted rather than
shipped with another model's photograph. Adding one is a single entry in
`VEHICLES` plus its image.

## Structure

```
app/                    layout, page, vehicles/[slug], service
components/
  layout/               Nav (mega-menu, mobile overlay), Footer
  home/                 Hero, VehicleGrid, Technology, Safety, Offers,
                        DealerLocator, TestDrive
  vehicle/              VehicleDetail shell, ModelHero, ColorSelector,
                        SpecBlocks, Gallery, FeatureRows, RelatedModels,
                        StickyBuyBar, Rav4Viewer
  service/              ServiceTabs, ProductGrid, ProductDrawer, CartSheet,
                        BookingFlow
  ui/                   GlassCard, MagneticButton, RevealText, Marquee,
                        ScrollProgress, CountUp, LenisProvider
lib/data/               vehicles.ts, products.ts, dealers.ts
lib/store/cart.ts       zustand + localStorage persistence
```

## Design system

Tokens live in `app/globals.css` under `@theme`, per `PLAN.md` §2 — which
overrides the UI/UX Pro Max skill where they conflict. The skill's "Liquid
Glass" preset calls for iridescent gradients and chromatic aberration; that was
dropped as incompatible with Toyota's restraint. What carried over is the
glass geometry (`blur(24px) saturate(180%)`, 24px radius) and the expo-out
curve `cubic-bezier(0.16, 1, 0.3, 1)`, which is the only easing used anywhere.

Toyota red (`#EB0A1E`) is an accent only — CTAs, active states, focus rings.

## Motion

Every animation respects `prefers-reduced-motion`: Lenis does not initialise,
transforms are dropped in favour of opacity, count-ups jump to their final
value, and the 360° viewer neither auto-spins nor carries momentum.

## 360° viewer

`components/vehicle/Rav4Viewer.tsx`. Renders to a single `<canvas>` — 36
stacked `<img>` elements were avoided deliberately.

- Preloads all 36 frames behind a progress line before enabling interaction
- Auto-spins on first view; halts **permanently** on first interaction
- Drag at ~8px/frame, wrapping mod 36, with `v *= 0.94` momentum decay
- `←`/`→` step one frame when focused; exposed as an ARIA `slider`
- Falls back to a static image if any frame fails to load
- The rotation sequence is **silver only** — other swatches cross-fade a static
  colour shot, and the UI says so rather than implying a colour rotation exists

## Known limitations

- No backend. Form submissions, checkout and bookings are simulated with a
  timeout; nothing is transmitted. Every such surface says so in the UI.
- The booking calendar shows the current month only, with Fridays disabled as
  the network-wide closure.
- Prices are indicative BDT for demonstration, not quotes.
