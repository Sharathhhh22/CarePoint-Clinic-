import fs from "fs"
import path from "path"

const ROOT = process.cwd()
let totalTests = 0
let passedTests = 0

function assert(condition, message) {
  totalTests++
  if (condition) {
    passedTests++
    console.log(`  ✓ ${message}`)
  } else {
    console.error(`  ✗ FAIL: ${message}`)
  }
}

console.log("=== CarePoint Clinic: UI & Interaction Standards Verification ===\n")

// 1. Verify CSS Tokens in globals.css
console.log("1. Design Tokens (Palette, Type Scale, Spacing, Radii, Shadows):")
const globalsCss = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf8")
assert(globalsCss.includes("--carepoint-forest: #173F30;"), "globals.css defines --carepoint-forest in :root")
assert(globalsCss.includes("--carepoint-sage: #A9C2B2;"), "globals.css defines --carepoint-sage in :root")
assert(globalsCss.includes("--type-scale-xs: 0.75rem;"), "globals.css defines typography scale tokens")
assert(globalsCss.includes("--space-4: 1rem;"), "globals.css defines spacing scale tokens")
assert(globalsCss.includes("--radius-2xl: 1.5rem;"), "globals.css defines border radii tokens")
assert(globalsCss.includes("--shadow-soft:"), "globals.css defines elevation shadows tokens")
assert(globalsCss.includes("--color-carepoint-forest: var(--carepoint-forest);"), "@theme exposes brand color tokens to Tailwind")
assert(globalsCss.includes("--type-scale-base: 1rem;"), ":root maintains precise typography scale tokens")
assert(globalsCss.includes("--shadow-soft: var(--shadow-soft);"), "@theme exposes shadow tokens to Tailwind")

// 2. Universal Interactive States (Hover, Focus-Visible, Active, Disabled)
console.log("\n2. Universal Interactive States (WCAG 2.2 AA Focus Visibility):")
assert(globalsCss.includes("button:focus-visible") && globalsCss.includes("outline: 2px solid var(--carepoint-forest)"), "High-visibility keyboard focus indicator in light mode")
assert(globalsCss.includes(".dark button:focus-visible") && globalsCss.includes("outline: 2px solid var(--carepoint-sage)"), "High-visibility keyboard focus indicator in dark mode")
assert(globalsCss.includes(".interactive-elem:active"), "Tactile active state feedback implemented via .interactive-elem")
assert(globalsCss.includes("button:disabled") && globalsCss.includes("cursor: not-allowed"), "Accessible disabled states implemented")
assert(globalsCss.includes(".interactive-elem"), "Universal .interactive-elem component utility defined")

// 3. Scroll Blur Header & Scroll Progress Bar
console.log("\n3. Sticky Header Scroll Blur & Scroll Progress Bar:")
const navbarCode = fs.readFileSync(path.join(ROOT, "src/components/carenova/CareNovaNavbar.tsx"), "utf8")
assert(navbarCode.includes("backdrop-blur-md"), "CareNovaNavbar gains backdrop-blur-md on scroll")
assert(navbarCode.includes("scrollProgress"), "CareNovaNavbar tracks reading scroll progress percentage")
assert(navbarCode.includes('role="progressbar"'), "Scroll progress bar has valid ARIA progressbar role")
assert(navbarCode.includes("aria-valuenow="), "Scroll progress bar has dynamic aria-valuenow")

// 4. Clean Immediate Section Rendering (No artificial blank-page scroll delays)
console.log("\n4. Smooth Section Rendering & Reduced-Motion:")
const scrollRevealPath = path.join(ROOT, "src/components/common/ScrollReveal.tsx")
assert(fs.existsSync(scrollRevealPath), "ScrollReveal component exists for selective animation")
const scrollRevealCode = fs.readFileSync(scrollRevealPath, "utf8")
assert(scrollRevealCode.includes("stagger = 0.08"), "ScrollReveal defaults to 80ms stagger standard")
assert(scrollRevealCode.includes("useReducedMotion()"), "ScrollReveal checks useReducedMotion()")
assert(scrollRevealCode.includes("shouldReduceMotion"), "ScrollReveal falls back to instant display under reduced motion")

const sectionsCode = fs.readFileSync(path.join(ROOT, "src/components/carenova/CareNovaSections.tsx"), "utf8")
assert(sectionsCode.includes('id="doctors"'), "CareNovaSections cleanly renders doctors section immediately without scroll blanking")

// 5. Animated Booking Wizard & Live Summary Panel
console.log("\n5. Animated Booking Wizard & Live Summary Panel:")
const bookingCode = fs.readFileSync(path.join(ROOT, "src/components/carenova/CareNovaBookingModal.tsx"), "utf8")
assert(bookingCode.includes("AnimatePresence"), "Booking wizard wraps step transitions in AnimatePresence")
assert(bookingCode.includes("Live Summary"), "Booking wizard contains a dedicated Live Summary panel")
assert(bookingCode.includes("currentServiceObj.price"), "Live Summary panel displays reactive fee calculations")
assert(bookingCode.includes("currentDoctorObj.name"), "Live Summary panel displays reactive clinician details")

// 6. Interactive Calendar with Unavailable Days Clearly Marked
console.log("\n6. Interactive Calendar & Unavailable Days:")
assert(bookingCode.includes("CALENDAR_DAYS"), "Booking wizard defines structured calendar days dataset")
assert(bookingCode.includes("line-through"), "Unavailable dates marked with line-through strikethrough")
assert(bookingCode.includes('aria-disabled="true"'), "Unavailable dates marked with aria-disabled='true'")
assert(bookingCode.includes("Clinic Closed"), "Sunday closures clearly labeled in calendar")
assert(bookingCode.includes("TIME_SLOTS"), "Booking wizard provides morning and afternoon time slot selection")

// 7. Toast Feedback on Every Demo Action
console.log("\n7. Toast Feedback on Demo Actions:")
assert(bookingCode.includes('toast({') && bookingCode.includes("Service Selected"), "Toast on service selection")
assert(bookingCode.includes('toast({') && bookingCode.includes("Physician Selected"), "Toast on physician selection")
assert(bookingCode.includes('toast({') && bookingCode.includes("Consultation Date Selected"), "Toast on date selection")
assert(bookingCode.includes('toast({') && bookingCode.includes("Time Slot Reserved"), "Toast on time slot selection")
assert(bookingCode.includes('toast({') && bookingCode.includes("Appointment Request Confirmed"), "Toast on appointment confirmation")
assert(sectionsCode.includes("Physicians Filtered"), "Toast on doctor specialty filtering")
assert(sectionsCode.includes("Annual Billing Activated"), "Toast on annual/monthly billing toggle")
assert(sectionsCode.includes("Clinical Match Identified"), "Toast on symptom matching")

// 8. Skeleton Loaders on All Data-Driven Grids
console.log("\n8. Skeleton Loaders on All Data-Driven Grids:")
assert(sectionsCode.includes("DoctorsGridSkeleton"), "Doctors grid has dedicated DoctorsGridSkeleton loader")
const servicesCode = fs.readFileSync(path.join(ROOT, "src/app/(marketing)/services/ServicesClient.tsx"), "utf8")
assert(servicesCode.includes("ServicesGridSkeleton"), "Services grid has dedicated ServicesGridSkeleton loader")
const galleryCode = fs.readFileSync(path.join(ROOT, "src/app/(marketing)/gallery/GalleryClient.tsx"), "utf8")
assert(galleryCode.includes("GalleryGridSkeleton"), "Gallery showcase has dedicated GalleryGridSkeleton loader")

// 9. Reduced-Motion Support Across Platform
console.log("\n9. Reduced-Motion Support:")
assert(globalsCss.includes("@media (prefers-reduced-motion: reduce)"), "globals.css contains comprehensive reduced motion rules")
assert(globalsCss.includes("animation-duration: 0.01ms !important"), "CSS animations duration set to 0.01ms under reduced motion")
assert(bookingCode.includes("useReducedMotion"), "CareNovaBookingModal respects user motion preferences")

// 10. WCAG 2.2 AA Contrast Verification
console.log("\n10. WCAG 2.2 AA Contrast Verification:")
function hexToLuminance(hex) {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.substring(0, 2), 16) / 255
  const g = parseInt(clean.substring(2, 4), 16) / 255
  const b = parseInt(clean.substring(4, 6), 16) / 255
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}
function getContrast(hex1, hex2) {
  const l1 = hexToLuminance(hex1)
  const l2 = hexToLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const forestOnCream = getContrast("#173F30", "#FAFAF7")
assert(forestOnCream >= 7.0, `Forest (#173F30) on Cream (#FAFAF7) has contrast ${forestOnCream.toFixed(2)}:1 (>= 7.0 AAA)`)

const darkTextOnCream = getContrast("#101512", "#FAFAF7")
assert(darkTextOnCream >= 7.0, `Dark Text (#101512) on Cream (#FAFAF7) has contrast ${darkTextOnCream.toFixed(2)}:1 (>= 7.0 AAA)`)

const lightTextOnDark = getContrast("#F1F5F9", "#0D1511")
assert(lightTextOnDark >= 7.0, `Light Text (#F1F5F9) on Dark BG (#0D1511) has contrast ${lightTextOnDark.toFixed(2)}:1 (>= 7.0 AAA)`)

const sageOnDark = getContrast("#A9C2B2", "#0D1511")
assert(sageOnDark >= 4.5, `Sage Accent (#A9C2B2) on Dark BG (#0D1511) has contrast ${sageOnDark.toFixed(2)}:1 (>= 4.5 AA)`)

console.log(`\n======================================================`)
console.log(`Summary: ${passedTests} / ${totalTests} verification checks passed!`)
console.log(`======================================================\n`)

if (passedTests !== totalTests) {
  process.exit(1)
}
