# Posh Puzzle: Editorial Luxury Design System & Visual Architecture

## 1. Design Concept & Philosophy

**"Haute Editorial Brutalism & Technical Precision"**  
Posh Puzzle bridges the gap between high-fashion editorial aesthetics (SSENSE, Farfetch) and high-performance keyboard-first ergonomics (Linear, Raycast).

### Core Pillars:
1. **Editorial Hierarchy**: Stark, confident typography with high contrast, generous whitespace, and purposeful asymmetrical layouts.
2. **Technical Monospaced Provenance**: Critical metadata (SKUs, atelier coordinates, material compositions, serial numbers, stock counts) is styled in precise, monospaced typography (`font-mono tracking-wider uppercase`).
3. **Deep Obsidian & Metallic Gold Accents**: Grounded in obsidian dark mode (`#050811`, `#090d16`) with warm amber-gold highlights (`#f59e0b`) evoking hand-brushed brass, platinum, and carbon fiber.
4. **Tactile Micro-Interactions**: Fluid, predictable responses with zero layout shift. Every interactive surface has a subtle hover lift, crisp focus ring, and purposeful feedback.

---

## 2. Color Palette & Token Architecture

### Base Surfaces:
- `bg-obsidian-950`: `#050811` (Deepest canvas background)
- `bg-obsidian-900`: `#090d16` (Card, drawer, and modal surfaces)
- `bg-obsidian-850`: `#0d1322` (Secondary container surfaces)
- `bg-obsidian-800`: `#141d33` (Input fields, hover states)

### Luxury Accent Tokens:
- `accent-gold-400`: `#fbbf24` (Hover highlight, active star ratings)
- `accent-gold-500`: `#f59e0b` (Primary brand accent, CTAs, focus rings)
- `accent-gold-600`: `#d97706` (Pressed state, badge borders)

### Monospaced & Neutral Tokens:
- `text-slate-100`: `#f1f5f9` (Primary editorial headings)
- `text-slate-300`: `#cbd5e1` (Body copy, high-readability labels)
- `text-slate-400`: `#94a3b8` (Secondary metadata, captions)
- `text-slate-500`: `#64748b` (Tertiary metadata, inactive icons)
- `border-white/10`: `rgba(255, 255, 255, 0.10)` (Subtle glassmorphic boundaries)
- `border-amber-500/30`: `rgba(245, 158, 11, 0.30)` (Active comparison or focus states)

### Semantic Status Tokens:
- **Verified / In Stock**: Emerald (`#10b981`, `bg-emerald-500/10 text-emerald-400 border-emerald-500/20`)
- **Scarcity / Urgent**: Rose (`#f43f5e`, `bg-rose-500/10 text-rose-400 border-rose-500/20`)
- **Atelier / Certified**: Amber (`#f59e0b`, `bg-amber-500/10 text-amber-400 border-amber-500/20`)
- **Global / Info**: Cyan (`#06b6d4`, `bg-cyan-500/10 text-cyan-400 border-cyan-500/20`)

---

## 3. Typography & Information Hierarchy

| Element | Font Family | Size / Leading | Weight / Tracking | Example Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | Sans-Serif / Editorial | `text-4xl md:text-6xl` | `font-extrabold tracking-tight` | "BESPOKE HARDWARE & CURATED HOROLOGY" |
| **Section Header** | Sans-Serif | `text-2xl md:text-3xl` | `font-bold tracking-tight` | "LIMITED ATELIER RELEASES" |
| **Card Title** | Sans-Serif | `text-base md:text-lg` | `font-semibold leading-snug` | "MacBook Pro M3 Max - Space Black" |
| **Monospaced Tag** | Monospace (`font-mono`) | `text-xs` | `font-medium uppercase tracking-wider` | `SKU: LPT-9821 // MILAN ATELIER` |
| **Price Tag** | Sans-Serif / Tabular | `text-lg md:text-xl` | `font-black tracking-tight` | "$3,499.00 / €3,219.08" |
| **Body / Description** | Sans-Serif | `text-sm leading-relaxed` | `font-normal text-slate-300` | Detailed specifications, reviews |

---

## 4. Components & Surface Patterns

### A. Monospaced Metadata Badges
```html
<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
  <ShieldCheck class="w-3 h-3 text-amber-400" />
  Verified Atelier
</span>
```

### B. High-Tactility Product Card
- **Border**: `border border-white/5 hover:border-amber-500/40 transition-all duration-200`
- **Surface**: `bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden group`
- **Image Treatment**: Subtle scale zoom on hover (`group-hover:scale-105 duration-300`)
- **Action Strip**: Quick Add to Cart, Quick Compare Toggle, Quick Authenticity Certificate View.

### C. Floating Comparison Dock
- Fixed bottom center dock (`fixed bottom-6 left-1/2 -translate-x-1/2 z-40`)
- Glassmorphic backdrop (`bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl rounded-2xl px-5 py-3`)
- Displays preview thumbnails of compared items, count badge (`N/4 items`), and action button "Compare Side-by-Side".

### D. Universal Command Palette (`Cmd+K`)
- Centered overlay with backdrop blur (`backdrop-blur-md bg-black/70`)
- High-speed search input with keyboard cursor selection (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`)
- Grouped sections: Quick Navigation, Catalog Categories, Currency Switching, Atelier Highlights.

---

## 5. Responsive & Accessibility Conventions

1. **Touch Targets**: All interactive elements (buttons, inputs, compare checkboxes) meet the minimum 44x44px touch target requirement.
2. **Contrast Standards**: All text tokens against obsidian surfaces maintain $\ge 4.5:1$ contrast ratio for body text and $\ge 3:1$ for large headings, satisfying WCAG 2.2 AA.
3. **Keyboard Focus Rings**: Visible, high-contrast gold outline: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`.
4. **Motion Safety**: Respects `prefers-reduced-motion: reduce` by dampening or bypassing scale and translation effects.
