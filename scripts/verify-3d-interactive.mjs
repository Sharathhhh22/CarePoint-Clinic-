import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const ARTIFACTS_DIR = "C:/Users/shara/.gemini/antigravity/brain/f91a00f6-91bd-4003-8ea0-cbbe8678e3c7"
fs.mkdirSync(ARTIFACTS_DIR, { recursive: true })

async function run3DVerification() {
  console.log("Starting 3D & Interactive UI/UX Verification...")
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  await page.addInitScript(() => {
    localStorage.setItem(
      "sloturself_cookie_consent_v1",
      JSON.stringify({ essential: true, analytics: false, functional: true })
    )
  })

  await page.setViewportSize({ width: 1440, height: 900 })

  // 1. Homepage & 3D Hero WebGL Canvas
  console.log("1. Checking Homepage & 3D Hero Canvas...")
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-3d-hero.png"), fullPage: false })

  // 2. 3D Anatomy Viewer in #symptom-matcher
  console.log("2. Checking 3D Anatomy Explorer on Homepage...")
  const anatomySection = page.locator("#symptom-matcher")
  if (await anatomySection.isVisible()) {
    await anatomySection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)

    // Click on Heart & Vascular
    const cardioHotspot = page.locator('button:has-text("Heart & Vascular")').first()
    if (await cardioHotspot.isVisible()) {
      await cardioHotspot.click()
      await page.waitForTimeout(500)
    }

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-3d-anatomy-viewer.png") })
  }

  // 3. Services Page & 3D Heart Monitor
  console.log("3. Checking Services Page & 3D Cardiac Monitor...")
  await page.goto("http://localhost:3000/services", { waitUntil: "networkidle" })
  await page.waitForTimeout(800)

  const heartMonitor = page.locator('text="Digital ECG Lead II Telemetry"').first()
  if (await heartMonitor.isVisible()) {
    await heartMonitor.scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)

    // Click Elevated (108) button
    const elevatedBtn = page.locator('button:has-text("Elevated (108)")').first()
    if (await elevatedBtn.isVisible()) {
      await elevatedBtn.click()
      await page.waitForTimeout(400)
    }

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-3d-cardiac-monitor.png") })
  }

  // 4. Gallery Page & 360 Virtual Tour
  console.log("4. Checking Gallery Page & 360 Virtual Tour...")
  await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" })
  await page.waitForTimeout(800)

  const tourSection = page.locator('text="Explore CarePoint Clinic in 360° 3D"').first()
  if (await tourSection.isVisible()) {
    await tourSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(800)

    // Click second room button
    const roomBtn = page.locator('button:has-text("Diagnostic")').first()
    if (await roomBtn.isVisible()) {
      await roomBtn.click()
      await page.waitForTimeout(600)
    }

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-3d-virtual-tour.png") })
  }

  // 5. Pricing Page with 3D Cards
  console.log("5. Checking Pricing Page 3D Cards...")
  await page.goto("http://localhost:3000/pricing", { waitUntil: "networkidle" })
  await page.waitForTimeout(800)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-3d-pricing-cards.png"), fullPage: false })

  await browser.close()
  console.log("All 3D interactive captures completed successfully!")
}

run3DVerification().catch(err => {
  console.error("Verification failed:", err)
  process.exit(1)
})
