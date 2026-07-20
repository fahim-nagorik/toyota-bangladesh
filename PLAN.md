# PLAN.md — Toyota Bangladesh Flagship Website Demo

**PROJECT:** Build a 2-page premium website demo for **Toyota Bangladesh** using **Next.js 16 (App Router)**.

**REFERENCE:** Existing site `https://www.toyota-bd.com/` (content/model reference only — do NOT copy its design). Structural inspiration from Toyota Bharat (`toyotabharat.com`). Visual bar: Apple.com.

---

## 0. DESIGN SKILL

Install and use the UI/UX Pro Max skill first:

```bash
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max -y
```

Reference: `https://ui-ux-pro-max-skill.nextlevelbuilder.io/#styles`
Apply the **"liquid glass"** style direction throughout the build.

Seed prompt for the aesthetic:

> *"Build an elegant luxury e-commerce landing page with liquid glass effects, high-end product showcase, storytelling sections, premium brand values, and exclusive membership CTA. Emphasize sophistication and exclusivity."*

Translate that language to Toyota Bangladesh:

- **Product showcase** → the vehicle range and the RAV4 360° experience
- **Storytelling sections** → Toyota heritage, reliability, engineering for Bangladesh's roads
- **Premium brand values** → Technology, Safety, Quality
- **E-commerce layer** → Genuine Parts & Engine Oil
- **Exclusive CTA** → Test Drive booking and Service appointment

> If the skill install fails or is unavailable, proceed using Section 2 alone — it fully encodes the same direction. **Tokens and rules in Section 2 override anything conflicting from the skill.**

---

## 1. TECH STACK (non-negotiable)

```
Next.js 16 (App Router, TypeScript, Turbopack)
Tailwind CSS v4
Framer Motion (motion/react) — all animations
Lenis — smooth scroll
shadcn/ui — primitives only, restyled
lucide-react — icons
next/image — all imagery
zustand — cart + booking state
react-hook-form + zod — all forms
No backend. Mock data in /lib/data/*.ts. Static export capable.
```

Folder structure:

```
app/
  layout.tsx
  page.tsx                    → Home
  vehicles/[slug]/page.tsx    → Model detail
  service/page.tsx            → Page 2 (Parts + Booking)
components/
  layout/    (Nav, Footer, MegaMenu)
  home/      (Hero, VehicleGrid, Technology, Safety, Offers, DealerLocator, TestDrive)
  vehicle/   (ModelHero, ColorSelector, SpecBlocks, Gallery, FeatureRows,
              RelatedModels, StickyBuyBar, Rav4Viewer)
  service/   (ShopHero, ProductGrid, ProductDrawer, CartSheet, BookingFlow)
  ui/        (GlassCard, MagneticButton, RevealText, Marquee, ScrollProgress)
lib/data/    (vehicles.ts, products.ts, dealers.ts)
public/
  logos/     (Toyota corporate + product logos, red/black/white RGB)
  rav4/360/  (001.webp … 036.webp)
  rav4/colors/ (silver, grey, blue, white .webp)
```

---

## 2. DESIGN SYSTEM

**Philosophy:** Apple's restraint + liquid-glass depth + Toyota's trust. Light, elegant, minimal. White space is the primary design element — if a section feels crowded, delete something.

### Color tokens

```css
--bg:            #FFFFFF
--bg-alt:        #FAFAFA   /* alternating section bands */
--bg-tint:       #F5F5F7   /* Apple grey */
--ink:           #0A0A0A
--ink-muted:     #6E6E73
--hairline:      rgba(0,0,0,0.08)
--toyota-red:    #EB0A1E   /* accent ONLY — CTAs, active states, ≤5% of any viewport */
--glass:         rgba(255,255,255,0.62)
--glass-border:  rgba(255,255,255,0.85)
```

### Liquid glass utility

Use on nav, floating cards, product overlays, color-swatch bar, segmented controls.

```css
backdrop-filter: blur(24px) saturate(180%);
background: var(--glass);
border: 1px solid var(--glass-border);
box-shadow: 0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
```

### Typography

- Display: `Inter` or `Geist`, weight 600, tracking `-0.03em`
- Scale: Hero `clamp(3rem, 8vw, 7.5rem)` · H2 `clamp(2rem, 4.5vw, 3.5rem)` · Body `17px/1.6` · Eyebrow `12px, uppercase, tracking 0.2em, --ink-muted`
- Max 2 weights per page. Body copy max-width `65ch`.

### Spacing & shape

- Section padding `clamp(96px, 14vh, 180px)` vertical
- Container `max-w-[1440px]`, gutters `24px` mobile / `64px` desktop
- 8pt grid
- Corners: cards `24px` · buttons `9999px` · images `20px`

### Motion language

- Easing: `[0.16, 1, 0.3, 1]` (expo-out) for everything
- Duration: micro `0.2s` · standard `0.6s` · hero `1.1s`
- Reveal pattern: `opacity 0→1, y 32→0`, stagger `0.08s`, `viewport={{ once: true, margin: "-15%" }}`
- Buttons: magnetic pull on cursor proximity (desktop), `scale 0.97` on tap
- Images: `scale 1.05 → 1` on scroll-in
- Respect `prefers-reduced-motion` — disable transforms, keep opacity

---

## 3. PAGE 1 — HOME (`/`)

### 3.1 Navigation

Fixed, transparent over hero → liquid-glass on scroll (`y > 60`). Toyota corporate logo (red RGB) left, links center (`Vehicles · Technology · Safety · Offers · Service · Dealers`), `Book a Test Drive` pill button right (red). Hovering "Vehicles" opens a full-width glass mega-menu with model thumbnails in a 4-col grid. Mobile: hamburger → full-screen overlay, links stagger in.

### 3.2 Hero

Full-viewport. Large RAV4 hero image, `object-cover`, subtle parallax (`y: 0 → 12%` on scroll). Headline reveals word-by-word with mask-up animation:

> **Let's Go Places.**
> *Engineered for Bangladesh's roads. Built to last a lifetime.*

Two CTAs: `Explore Vehicles` (solid red pill) · `Book a Test Drive` (glass pill). Scroll cue at bottom, gently bobbing. Optional: hero image scales down and corners round to `32px` as you scroll into section 2 (Apple product-page signature).

### 3.3 Vehicle Showcase

Eyebrow `THE RANGE` → H2 `Find your Toyota.`

Filter pills: `All · SUV · Sedan · Hybrid · Pickup · MPV`. Filtering animates with `layout` + `AnimatePresence`.

Grid of vehicle cards (3-col desktop / 2 tablet / 1 mobile). Each card: white surface, hairline border, generous internal padding, vehicle image floating on `--bg-tint`, model name, body type, `Starting from ৳ XX,XX,XXX`. On hover: card lifts `y: -8`, shadow deepens, image scales `1.04`, a red `→` slides in. **Every card links to `/vehicles/[slug]`.**

**Models** (pull names/specs from toyota-bd.com): RAV4, Corolla Cross, Corolla Altis, Camry, Yaris, Hilux, Fortuner, Land Cruiser, Land Cruiser Prado, Hiace, Rush, Raize, Prius, C-HR. Assign each a body type, price, engine, and a 2-line description in `lib/data/vehicles.ts`.

### 3.4 Technology

Dark section (`#0A0A0A`) for contrast — the one dark band on the page. Three glass cards on dark: **Toyota Hybrid System**, **Toyota Safety Sense**, **Connected Services**. Each with an icon, headline, 2-line body, and a `Learn more →` link. Cards tilt subtly toward the cursor (max 6°).

### 3.5 Safety

Back to white. Full-width image with a soft radial vignette. Overlaid stat counters that animate on scroll: `5★ ASEAN NCAP` · `8 SRS Airbags` · `360° Camera` · `Pre-Collision System`. Below: a 4-item horizontal list of TSS features with hairline dividers.

### 3.6 Offers

Horizontal drag-scroll carousel of 4 glass offer cards: `0% Interest EMI` · `Free 3-Year Maintenance` · `Trade-In Bonus` · `Genuine Parts Discount`. Each card has a subtle red gradient wash in the corner, terms line, and `Claim Offer` link. Snap-scroll on mobile.

### 3.7 Dealer Locator

Two-column split. **Left:** search input + a scrollable list of dealer cards (Dhaka, Chattogram, Sylhet, Khulna, Rajshahi, Bogura) with address, phone, hours. **Right:** stylized static map panel with red pin markers; selecting a dealer animates its pin to `scale 1.3` and pans the panel. Active card gets a red left border and glass background.

### 3.8 Test Drive

Centered, narrow (`max-w-2xl`), lots of white space. Glass form card: `Name · Phone · Email · Model (select) · Preferred Dealer (select) · Date`. Floating labels that animate up on focus. Red submit button. On submit: card flips to a success state with an animated checkmark stroke-draw.

### 3.9 Footer

Light `--bg-tint`. 4 columns (Vehicles · Services · Company · Support), Toyota corporate logo (black RGB), social icons, newsletter input with inline arrow button, legal row, and a large ghosted `TOYOTA` wordmark bleeding off the bottom edge at 4% opacity.

---

## 4. MODEL DETAIL PAGE (`/vehicles/[slug]`)

**Every model in `lib/data/vehicles.ts` gets a working detail page — not just RAV4.** One template, real per-model specs, colors, gallery, and copy. Generate static params for all slugs.

Shared-layout transition from the grid card into the detail hero.

### 4.1 Sections

1. **Hero** — large vehicle image on `--bg-tint`, model name, `Starting from ৳ XX,XX,XXX`, body-type eyebrow, `Book Test Drive` (red) + `Download Brochure` (glass) CTAs
2. **Color selector** — glass swatch bar below the hero; clicking cross-fades the vehicle image (`0.5s`, expo-out). Active swatch gets a red ring
3. **Specs** — 4 large stat blocks: Engine · Power · Transmission · Fuel Economy. Numbers count up on scroll into view
4. **Gallery** — horizontal scroll-snap strip, drag to pan, 5–6 shots per model
5. **Features** — 3 alternating image/text rows; image slides in from the opposite side of the text
6. **Related models** — 3 cards from the same body type
7. **Sticky mobile bar** — appears past the hero on `< 768px`: price on the left, `Book Test Drive` pill on the right, glass background, safe-area padding

### 4.2 RAV4 override

RAV4's page is the flagship. It uses the same template but **replaces the Gallery section with the 360° viewer** below.

### 4.3 RAV4 360° Viewer ⭐ (centerpiece)

Full-bleed section on `--bg-tint`, generous vertical padding.

- **36 frames**: `/public/rav4/360/001.webp → 036.webp`
- **Preload all** frames before enabling interaction; show a thin red progress line + `Loading experience` label
- **Drag to rotate**: pointer/touch drag maps horizontal delta → frame index, wraps modulo 36. Sensitivity ~`8px per frame`. Use `requestAnimationFrame`; never re-mount `<img>` — render all 36 stacked with `opacity` toggling, or swap `src` on a single preloaded set
- **Auto-spin** slowly on first view, halts permanently on first user interaction
- **Momentum**: on drag release, decay velocity with friction (`v *= 0.94`) until it settles
- **UI**: glass pill below the car with a drag-handle icon + `Drag to explore` (fades out after first interaction); frame indicator dots optional
- **Color swatches** (silver / grey / blue / white `.webp`) in a glass bar — switching colors cross-fades the static hero shot. Add a code comment noting the 360 sequence is silver-only in this demo
- **Hotspots**: 3–4 pulsing red dots over the car (Headlamps, Alloy Wheels, Panoramic Roof, Rear Spoiler) opening a small glass tooltip card on click
- Cursor becomes `grab` / `grabbing`. Fully touch-supported. Falls back to a static image if JS fails
- Keyboard: `←` / `→` step frames when the viewer has focus

---

## 5. PAGE 2 — SERVICE & COMMERCE (`/service`)

Tab switcher at top (glass segmented control, animated pill indicator): **`Shop Parts`** | **`Book a Service`**.

### 5.1 Shop Parts

- **Hero:** short, elegant. `Genuine Toyota Parts.` / `Engineered by the people who built your car.`
- **Category rail:** `Engine Oil · Filters · Brakes · Batteries · Wipers · Accessories`
- **Product grid** (3-col): 12 mock products — Toyota Genuine Motor Oil 0W-20 (1L/4L), 5W-30, Oil Filter, Air Filter, Cabin Filter, Brake Pads (Front/Rear), Battery, Wiper Blades, Spark Plugs, Coolant. Card: product image on `--bg-tint`, name, part number in mono, `৳ price`, `Add to Cart`
- **Micro-interaction:** Add to Cart → button morphs to a checkmark, product image ghosts and flies toward the cart icon, cart badge bounces
- **Product drawer:** clicking a card slides in a right-side glass drawer with larger image, description, compatibility list, quantity stepper
- **Cart sheet:** slides from right. Line items with `AnimatePresence` removal, quantity steppers, subtotal + VAT + total counting up on change, `Proceed to Checkout` button. Persist via zustand. Empty state included.

### 5.2 Book a Service

Multi-step flow with a horizontal progress bar (red fill animates between steps). Steps slide horizontally; validate before advancing. Back navigation preserves all state.

1. **Vehicle** — select model (visual cards), enter registration number + mileage
2. **Service type** — 3 glass option cards: `Periodic Maintenance` / `Repair & Diagnostics` / `Body & Paint`, each with description, est. duration, starting price
3. **Dealer & Slot** — dealer dropdown, calendar grid (current month, past dates disabled), time-slot pills; selecting animates a red fill
4. **Details** — name, phone, email, notes textarea
5. **Confirmation** — glass summary card, animated checkmark, mock booking ref `TBD-2026-0417`, `Add to Calendar` + `Book Another` buttons

---

## 6. QUALITY BAR

- **Mobile-first.** Build at 375px, scale up. Test 375 / 768 / 1024 / 1440 / 1920.
- **Touch targets** ≥ 44px. 360° viewer and all carousels fully touch-draggable.
- **Performance:** Lenis-smooth 60fps. Animate only `transform` + `opacity`. `will-change` sparingly. All images via `next/image` with `sizes`; hero `priority`, rest lazy.
- **Accessibility:** semantic HTML, visible focus rings (red, 2px offset), `aria-label` on icon buttons, keyboard-navigable 360° viewer, alt text everywhere.
- **Loading states** on every async-feeling interaction.
- **No lorem ipsum.** Write real Bangladesh-contextual copy — BDT pricing, Dhaka/Chattogram dealer names, local phone formats.
- **Brand discipline:** Toyota red is an accent, never a background wash. Never distort or recolor the logo. Never place the red logo on a red surface.

---

## 7. BUILD ORDER

1. Install the UI/UX Pro Max skill (Section 0) and lock the liquid-glass direction
2. Scaffold Next.js 16 + Tailwind v4 + Lenis + Framer Motion; establish tokens in `globals.css`
3. Nav + Footer + shared UI primitives (`GlassCard`, `MagneticButton`, `RevealText`)
4. Mock data files (`vehicles.ts`, `products.ts`, `dealers.ts`)
5. Home: Hero → Vehicles → Technology → Safety → Offers → Dealers → Test Drive
6. Model detail template + `generateStaticParams` for all models
7. **RAV4 360° viewer** — budget the most time here; it's the demo's proof point
8. Service page: tabs → shop → cart → booking flow
9. Responsive pass, then motion polish pass

**Deliver working code, not scaffolding.** Every section fully built and populated. When a choice is ambiguous, choose the option with more white space and less ornament.
