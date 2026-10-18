import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const ARTIFACTS_DIR = "C:/Users/shara/.gemini/antigravity/brain/f91a00f6-91bd-4003-8ea0-cbbe8678e3c7"
fs.mkdirSync(ARTIFACTS_DIR, { recursive: true })

async function runVerification() {
  console.log("Launching browser for visual verification...")
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  // Suppress cookie banner by setting accepted preference in localStorage
  await page.addInitScript(() => {
    localStorage.setItem(
      "sloturself_cookie_consent_v1",
      JSON.stringify({ essential: true, analytics: false, functional: true })
    )
  })

  const consoleErrors = []
  page.on("console", msg => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text())
    }
  })

  async function scrollToBottomAndBack(p) {
    await p.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0
        const distance = 400
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance
          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            window.scrollTo(0, 0)
            resolve()
          }
        }, 100)
      })
    })
    await p.waitForTimeout(600)
  }

  // 1. Desktop Viewport (1440px)
  console.log("Testing 1440px Desktop...")
  await page.setViewportSize({ width: 1440, height: 900 })
  const res = await page.goto("http://localhost:3002/", { waitUntil: "networkidle" })
  console.log("Homepage status:", res.status())
  await scrollToBottomAndBack(page)

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-1440-desktop-hero.png"), fullPage: false })
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-1440-desktop-full.png"), fullPage: true })

  // 2. Tablet Landscape / Small Desktop (1024px)
  console.log("Testing 1024px Tablet Landscape...")
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-1024-tablet.png"), fullPage: false })

  // 3. Tablet Portrait (768px)
  console.log("Testing 768px Tablet Portrait...")
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-768-portrait.png"), fullPage: false })

  // 4. Mobile (390px)
  console.log("Testing 390px Mobile...")
  await page.setViewportSize({ width: 390, height: 844 })
  await scrollToBottomAndBack(page)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-390-mobile-hero.png"), fullPage: false })
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-390-mobile-full.png"), fullPage: true })

  // 5. Small Mobile (360px)
  console.log("Testing 360px Small Mobile...")
  await page.setViewportSize({ width: 360, height: 780 })
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-360-small-mobile.png"), fullPage: false })

  // 6. Interactive Modal Tests (Desktop 1440px)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("http://localhost:3002/", { waitUntil: "networkidle" })

  // Test Search Modal
  console.log("Testing Search Modal...")
  const searchBtn = await page.locator('header button[aria-label*="Search"]').first()
  await searchBtn.click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-modal-search.png") })
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)

  // Test Watch Video Modal
  console.log("Testing Video Modal...")
  const videoBtn = await page.locator('text=Watch Our Video').first()
  await videoBtn.click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-modal-video.png") })
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)

  // Test Booking Modal
  console.log("Testing Booking Modal...")
  const bookBtn = await page.locator('header button:has-text("Book an Appointment")').first()
  await bookBtn.click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-modal-booking-step1.png") })

  // Advance to Step 2
  await page.click('button:has-text("Continue")')
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-modal-booking-step2.png") })

  // Advance to Step 3
  await page.click('button:has-text("Continue")')
  await page.waitForTimeout(300)

  // Fill patient details
  await page.fill('input[placeholder="e.g. Jane Doe"]', "Eleanor Vance")
  await page.fill('input[placeholder="jane@example.com"]', "eleanor.vance@example.com")
  await page.fill('input[placeholder="+1 (555) 000-0000"]', "+1 555 423 8899")
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-modal-booking-step3.png") })

  // Submit appointment
  await page.click('button:has-text("Confirm Appointment")')
  await page.waitForTimeout(800)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-modal-booking-confirmed.png") })
  await page.click('button:has-text("Done")')
  await page.waitForTimeout(300)

  // Test FAQ Accordion
  console.log("Testing FAQ Accordion...")
  const faqItem = await page.locator('button:has-text("Can I reschedule an appointment?")').first()
  await faqItem.click()
  await page.waitForTimeout(300)

  // Test Legal Modal
  console.log("Testing Privacy Policy Modal...")
  const privacyBtn = await page.locator('footer button:has-text("Privacy Policy")').first()
  await privacyBtn.click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carenova-modal-privacy.png") })

  await browser.close()
  console.log("Verification finished successfully!")
  console.log("Console errors detected:", consoleErrors.length, consoleErrors)
}

runVerification().catch(err => {
  console.error("Verification failed:", err)
  process.exit(1)
})
