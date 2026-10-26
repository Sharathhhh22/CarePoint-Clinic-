import { test, expect } from "@playwright/test"

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
]

const PAGES = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Doctors", path: "/doctors" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
  { name: "Book", path: "/book" },
]

test.describe("CarePoint Clinic - Cross-Viewport Responsive Layout Suite", () => {
  for (const pageItem of PAGES) {
    for (const vp of VIEWPORTS) {
      test(`${pageItem.name} at ${vp.width}px - zero overflow & compliance`, async ({ page }) => {
        await page.setViewportSize(vp)
        await page.goto(pageItem.path, { waitUntil: "domcontentloaded" })
        await page.waitForTimeout(600) // Allow layout settling and fonts

        // a. Zero horizontal overflow assertion
        const overflowCheck = await page.evaluate(() => {
          const docEl = document.documentElement
          const scrollWidth = docEl.scrollWidth
          const clientWidth = docEl.clientWidth
          return {
            scrollWidth,
            clientWidth,
            hasOverflow: scrollWidth > clientWidth + 1, // 1px rounding tolerance
          }
        })
        expect(
          overflowCheck.hasOverflow,
          `Horizontal overflow detected on ${pageItem.name} at ${vp.width}px: scrollWidth (${overflowCheck.scrollWidth}) > clientWidth (${overflowCheck.clientWidth})`
        ).toBe(false)

        // b. Touch target height >= 44px on viewports under 768px
        if (vp.width < 768) {
          const buttonTargetMetrics = await page.evaluate(() => {
            const elements = Array.from(
              document.querySelectorAll<HTMLElement>(
                "button:not([aria-hidden='true']), a[role='button'], a.btn-text, div[role='button']:not([aria-hidden='true'])"
              )
            )

            return elements
              .filter((el) => {
                const style = window.getComputedStyle(el)
                const rect = el.getBoundingClientRect()
                // Only assess visible, non-hidden interactive elements in document flow
                return (
                  style.display !== "none" &&
                  style.visibility !== "hidden" &&
                  style.opacity !== "0" &&
                  rect.width > 0 &&
                  rect.height > 0 &&
                  !el.closest(".hidden") &&
                  !el.closest("[aria-hidden='true']") &&
                  !el.classList.contains("sr-only")
                )
              })
              .map((el) => {
                const rect = el.getBoundingClientRect()
                return {
                  text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 35),
                  height: Math.round(rect.height * 10) / 10,
                  width: Math.round(rect.width * 10) / 10,
                }
              })
          })

          for (const btn of buttonTargetMetrics) {
            // Touch targets must be >= 44px height (allowing 0.5px subpixel rendering margin: >= 43.5px)
            // Skip non-interactive tiny inline badges if mistakenly queried
            if (btn.width >= 40) {
              expect(
                btn.height,
                `Button "${btn.text}" height ${btn.height}px is < 44px on viewport ${vp.width}px`
              ).toBeGreaterThanOrEqual(43.5)
            }
          }
        }

        // c. Hero CTA button stacking verification on Home page
        if (pageItem.path === "/") {
          const heroStacking = await page.evaluate(() => {
            const heroGroup = document.querySelector<HTMLElement>("[data-hero-cta]")
            const heroButtons = heroGroup
              ? Array.from(heroGroup.querySelectorAll<HTMLElement>("button, a"))
              : Array.from(
                  document.querySelectorAll<HTMLElement>("section:first-of-type button, section:first-of-type a")
                ).filter((el) => {
                  const text = (el.textContent || "").toLowerCase()
                  return (
                    text.includes("book an appointment") ||
                    text.includes("watch our video") ||
                    text.includes("explore services")
                  )
                })

            if (heroButtons.length < 2) return null

            const rect1 = heroButtons[0].getBoundingClientRect()
            const rect2 = heroButtons[1].getBoundingClientRect()

            return {
              b1Top: rect1.top,
              b1Left: rect1.left,
              b2Top: rect2.top,
              b2Left: rect2.left,
              isStacked: rect2.top >= rect1.bottom - 8,
              isRow: Math.abs(rect1.top - rect2.top) < 16 && rect2.left > rect1.left,
            }
          })

          if (heroStacking) {
            if (vp.width < 640) {
              expect(
                heroStacking.isStacked,
                `Expected Hero CTAs to stack vertically at ${vp.width}px, but they were inline`
              ).toBe(true)
            } else {
              expect(
                heroStacking.isRow,
                `Expected Hero CTAs to sit in a row at ${vp.width}px, but they were stacked`
              ).toBe(true)
            }
          }
        }
      })
    }
  }
})
