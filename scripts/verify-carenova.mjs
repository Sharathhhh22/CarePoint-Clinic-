import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const ARTIFACTS_DIR = "C:/Users/shara/.gemini/antigravity/brain/f91a00f6-91bd-4003-8ea0-cbbe8678e3c7"
fs.mkdirSync(ARTIFACTS_DIR, { recursive: true })

async function runVerification() {
  console.log("Launching browser for multi-page visual verification...")
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

  // 1. Desktop Viewport (1440px) Homepage
  console.log("1. Testing 1440px Desktop Homepage...")
  await page.setViewportSize({ width: 1440, height: 900 })
  const res = await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
  console.log("Homepage status:", res.status())
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-1440-desktop.png"), fullPage: false })

  // Test WhatsApp popup
  console.log("Testing WhatsApp enquiry popup...")
  const waBtn = await page.locator('button[aria-label*="WhatsApp"]').first()
  if (await waBtn.isVisible()) {
    await waBtn.click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-whatsapp-popup.png") })
    await waBtn.click()
    await page.waitForTimeout(300)
  }

  // 2. Testing About Page (/about)
  console.log("2. Testing About Us Page (/about)...")
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" })
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-page-about.png"), fullPage: false })

  // 3. Testing Services Page (/services)
  console.log("3. Testing Services Page (/services)...")
  await page.goto("http://localhost:3000/services", { waitUntil: "networkidle" })
  await page.waitForTimeout(500)
  // Test category filter click
  const cardioTab = await page.locator('button:has-text("Cardiovascular")').first()
  if (await cardioTab.isVisible()) {
    await cardioTab.click()
    await page.waitForTimeout(300)
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-page-services.png"), fullPage: false })

  // 4. Testing Facilities & Gallery Page (/gallery)
  console.log("4. Testing Gallery Page (/gallery)...")
  await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" })
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-page-gallery.png"), fullPage: false })

  // Test Gallery Lightbox Modal
  console.log("Testing Gallery Lightbox Modal...")
  const galleryCard = await page.locator('h3:has-text("Advanced Cardiac")').first()
  if (await galleryCard.isVisible()) {
    await galleryCard.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-gallery-lightbox.png") })
    await page.keyboard.press("Escape")
    await page.waitForTimeout(300)
  }

  // 5. Testing Pricing & Insurance Page (/pricing)
  console.log("5. Testing Pricing Page (/pricing)...")
  await page.goto("http://localhost:3000/pricing", { waitUntil: "networkidle" })
  await page.waitForTimeout(500)
  // Select an insurance network
  const selectInsurance = await page.locator("select").first()
  if (await selectInsurance.isVisible()) {
    await selectInsurance.selectOption("aetna")
    await page.waitForTimeout(300)
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-page-pricing.png"), fullPage: false })

  // 6. Testing Contact Page (/contact) & Form Validation/Submission
  console.log("6. Testing Contact Page (/contact)...")
  await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle" })
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-page-contact.png"), fullPage: false })

  console.log("Testing Contact Form submission...")
  await page.fill('input[name="firstName"]', "Jonathan")
  await page.fill('input[name="lastName"]', "Hayes")
  await page.fill('input[name="email"]', "jonathan.hayes@example.com")
  await page.fill('input[name="phone"]', "+1 617 555 0192")
  await page.fill('textarea[name="message"]', "Looking to transfer medical records and schedule a comprehensive cardiovascular checkup.")
  await page.click('button:has-text("Submit Consultation Enquiry")')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-contact-confirmed.png") })

  // 7. Testing Mobile Viewport (390px)
  console.log("7. Testing Mobile Responsive Viewport (390px)...")
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("http://localhost:3000/services", { waitUntil: "networkidle" })
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "carepoint-mobile-services.png"), fullPage: false })

  await browser.close()
  console.log("Multi-page verification finished successfully!")
  console.log("Console errors detected:", consoleErrors.length, consoleErrors)
}

runVerification().catch(err => {
  console.error("Verification failed:", err)
  process.exit(1)
})
