# CarePoint Clinic: Design Decisions & Responsive Layout Architecture

## 1. Responsive Breakpoint Specification

CarePoint Clinic strictly adheres to the standard **mobile-first** responsive breakpoint continuum provided by Tailwind CSS. Custom media queries have been eliminated in favor of clean, standardized utility prefixes:

| Prefix | Minimum Width | CSS / Media Query Equivalent | Target Device Category |
| :--- | :--- | :--- | :--- |
| *(default)* | `0px` | Unprefixed base rules (`w-full`, etc.) | Compact Mobile (320px – 639px, e.g., iPhone SE, Galaxy S21) |
| `sm:` | `640px` (`40rem`) | `@media (min-width: 640px)` | Large Mobile & Small Tablets in portrait |
| `md:` | `768px` (`48rem`) | `@media (min-width: 768px)` | Standard Tablets (iPad Mini, iPad Air portrait) |
| `lg:` | `1024px` (`64rem`) | `@media (min-width: 1024px)` | Landscape Tablets & Compact Laptops |
| `xl:` | `1280px` (`80rem`) | `@media (min-width: 1280px)` | Desktop Workstations (1080p, Standard Monitors) |
| `2xl:` | `1536px` (`96rem`) | `@media (min-width: 1536px)` | Large Widescreen Monitors & Retina Displays |

### Architectural Rules:
1. **Strict Mobile-First**: All component layouts begin with single-column, touch-optimized defaults. Enhancements (multi-column grids, horizontal row button groupings) are introduced strictly via min-width utility prefixes (`sm:`, `md:`, `lg:`).
2. **Zero Conflicting Max-Width Queries**: Max-width media queries (`max-width: 640px`) have been completely purged from CSS stylesheets. Inputs default to `16px` base font size across mobile viewports to prevent unwanted iOS Safari auto-zoom while maintaining full WCAG accessibility.
3. **Container Standardization**: All page sections utilize the unified `Container` component (`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`). No individual page or section defines bespoke max-widths.

---

## 2. Button & Interactive Target Standards (WCAG 2.5.8)

All interactive buttons and navigation links across CarePoint Clinic conform to the unified `Button` component architecture (`src/components/ui/Button.tsx`):

1. **Touch Target Dimensions**: Base class guarantees `min-h-11` (`44px` height) across all button variants and sizes, fulfilling WCAG 2.5.8 Target Size (Minimum) criteria.
2. **Baseline Alignment & Non-Shifting Icons**: Icons inside buttons are explicitly sized (`size-5` or `w-4 h-4`) and marked with `aria-hidden="true"` to prevent baseline displacement and optical unbalancing.
3. **Responsive Button Groups**: Button groups implement the standard wrapper `flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap`. Buttons inside take `w-full sm:w-auto` so they effortlessly stack on mobile screens (<640px) and sit side-by-side on tablet/desktop viewports (>=640px).
4. **Link-Button Unification**: Navigational anchors requiring button visual styling wrap Next.js `<Link>` with `<Button asChild>` to ensure 100% visual and accessibility parity between actions and links.

---

## 3. Grid & Card Height Alignment

In data-driven card grids (Physicians, Services, Pricing Tiers):
- Grid cells utilize `h-full` and `.card-grid-item` flex layouts.
- Primary card action footers enforce `mt-auto` anchoring, ensuring bottom action buttons on every card in a row sit at the identical baseline regardless of text length variations.
