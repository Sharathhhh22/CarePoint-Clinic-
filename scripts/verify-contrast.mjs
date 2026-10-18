// scripts/verify-contrast.mjs
// Rigorous WCAG 2.1 Contrast Testing Suite for Light and Dark Themes

function hexToRgb(hex) {
  hex = hex.replace("#", "").trim()
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("")
  }
  const num = parseInt(hex, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function getLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const TESTS = [
  // ==========================================
  // LIGHT THEME CONTRAST TESTS (Min 4.5:1 normal, 3:1 large/UI)
  // ==========================================
  {
    theme: "Light",
    context: "Body Heading & Body text on Page Background",
    foreground: "#101512",
    background: "#FAFAF7",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Light",
    context: "Primary Headings on Card Background",
    foreground: "#101512",
    background: "#FFFFFF",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Light",
    context: "Brand Forest Green text on Page Background",
    foreground: "#173F30",
    background: "#FAFAF7",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Light",
    context: "White Text on Primary Forest Green CTA Button",
    foreground: "#FFFFFF",
    background: "#173F30",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Light",
    context: "Muted Text on Page Background",
    foreground: "#475569",
    background: "#FAFAF7",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Light",
    context: "Dark Sage Text on Light Mint Badge",
    foreground: "#173F30",
    background: "#E7EEE8",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },

  // ==========================================
  // DARK THEME CONTRAST TESTS (Min 4.5:1 normal, 3:1 large/UI)
  // ==========================================
  {
    theme: "Dark",
    context: "Primary Light Text on Dark Page Background",
    foreground: "#EAEFEA",
    background: "#0D1511",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Dark",
    context: "Primary Light Text on Dark Card Surface",
    foreground: "#EAEFEA",
    background: "#121B16",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Dark",
    context: "Sage Accent Brand Text on Dark Page Background",
    foreground: "#A9C2B2",
    background: "#0D1511",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Dark",
    context: "Sage Accent Brand Text on Dark Card Surface",
    foreground: "#A9C2B2",
    background: "#121B16",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Dark",
    context: "Muted Slate Text on Dark Card Surface",
    foreground: "#CBD5E1",
    background: "#121B16",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Dark",
    context: "Dark Mode Input Borders on Background (UI Component)",
    foreground: "#4E6C5D",
    background: "#0D1511",
    requiredRatio: 3.0,
    level: "WCAG AA UI & Graphical Elements",
  },
  {
    theme: "Dark",
    context: "White Text on Dark Green Button Background",
    foreground: "#FFFFFF",
    background: "#173F30",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
  {
    theme: "Dark",
    context: "Sage Accent Badge text on Dark Forest Button",
    foreground: "#A9C2B2",
    background: "#173F30",
    requiredRatio: 4.5,
    level: "WCAG AA Normal Text",
  },
]

console.log("\n=======================================================")
console.log("🎨 WCAG 2.1 AA Contrast Ratio Verification Suite")
console.log("=======================================================\n")

let passed = 0
let failed = 0

for (const t of TESTS) {
  const ratio = getContrastRatio(t.foreground, t.background)
  const isPass = ratio >= t.requiredRatio
  const formattedRatio = ratio.toFixed(2) + ":1"

  if (isPass) {
    console.log(
      `✅ [PASS] [${t.theme.padEnd(5)}] ${t.context.padEnd(48)} -> ${formattedRatio.padEnd(8)} (Target: >= ${t.requiredRatio}:1, ${t.level})`
    )
    passed++
  } else {
    console.error(
      `❌ [FAIL] [${t.theme.padEnd(5)}] ${t.context.padEnd(48)} -> ${formattedRatio.padEnd(8)} (Target: >= ${t.requiredRatio}:1, ${t.level})`
    )
    failed++
  }
}

console.log("\n=======================================================")
console.log(`Contrast Test Summary: ${passed}/${TESTS.length} tests passed successfully!`)
console.log("=======================================================\n")

if (failed > 0) {
  process.exit(1)
}
