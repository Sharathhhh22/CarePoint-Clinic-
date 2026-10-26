import { test } from "@playwright/test"

test("capture user profile screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })

  // 1. Home page with User Profile Pill in Navbar
  await page.goto("/", { waitUntil: "networkidle" })
  await page.screenshot({ path: "C:/Users/shara/.gemini/antigravity/brain/f91a00f6-91bd-4003-8ea0-cbbe8678e3c7/carepoint-website-profile-pill.png" })

  // 2. Open User Profile Dropdown
  const profileBtn = page.locator("button[aria-label*='User account and profile']")
  if (await profileBtn.count() > 0) {
    await profileBtn.first().click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: "C:/Users/shara/.gemini/antigravity/brain/f91a00f6-91bd-4003-8ea0-cbbe8678e3c7/carepoint-profile-dropdown.png" })

    // 3. Click "Quick Profile Info" to open the In-Website Modal
    const quickModalTrigger = page.locator("text='Quick Profile Info'")
    if (await quickModalTrigger.count() > 0) {
      await quickModalTrigger.first().click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: "C:/Users/shara/.gemini/antigravity/brain/f91a00f6-91bd-4003-8ea0-cbbe8678e3c7/carepoint-inwebsite-profile-modal.png" })
    }
  }

  // 4. Mobile Viewport (390px)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/", { waitUntil: "networkidle" })
  const hamburger = page.locator("button[aria-label*='mobile navigation menu']")
  if (await hamburger.count() > 0) {
    await hamburger.first().click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: "C:/Users/shara/.gemini/antigravity/brain/f91a00f6-91bd-4003-8ea0-cbbe8678e3c7/carepoint-mobile-profile-drawer.png" })
  }
})
