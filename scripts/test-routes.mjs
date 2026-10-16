// scripts/test-routes.mjs
// Fast automated route test script for SlotUrSelf
// Usage: node scripts/test-routes.mjs [baseUrl]
// Example: node scripts/test-routes.mjs https://slot-yourself-7afv.vercel.app

const BASE_URL = process.argv[2] || process.env.TEST_URL || "https://slot-yourself-7afv.vercel.app"

const ROUTES = [
  { path: "/", title: "Homepage", mustContain: ["SlotUrSelf", "Book your clinic appointment instantly", "Browse by Specialty"] },
  { path: "/features", title: "Features", mustContain: ["Real-Time Slot Reservation", "Doctor Credential Screening"] },
  { path: "/clinics", title: "Find Clinics", mustContain: ["Find verified clinics", "Bengaluru"] },
  { path: "/departments", title: "Departments", mustContain: ["General Medicine", "Pediatrics", "Cardiology"] },
  { path: "/assistant", title: "AI Symptom Checker", mustContain: ["AI Symptom Checker", "108"] },
  { path: "/how-it-works", title: "How It Works", mustContain: ["Find Your Specialist", "held exclusively for 10 minutes"] },
  { path: "/about", title: "About Us", mustContain: ["Direct clinic appointments", "Doctor Credential Screening"] },
  { path: "/contact", title: "Contact Us", mustContain: ["support@sloturself.com", "Bengaluru"] },
  { path: "/signup", title: "Sign Up (Account Selection)", mustContain: ["How would you like to join?", "Patient", "Doctor"] },
  { path: "/signup?type=patient", title: "Patient Registration Form", mustContain: ["Patient Registration", "Create Patient Account"] },
  { path: "/signup?type=doctor", title: "Doctor Registration Form", mustContain: ["Doctor Registration", "Step 1 of 3"] },
  { path: "/login", title: "Log In", mustContain: ["Welcome Back", "Log in to access your appointments"] },
  { path: "/forgot-password", title: "Password Reset", mustContain: ["Reset Password", "Send Reset Link"] },
  { path: "/privacy", title: "Privacy Policy", mustContain: ["DPDP Act", "SlotUrSelf"] },
  { path: "/terms", title: "Terms of Service", mustContain: ["Terms of Service", "108"] },
]

async function runTests() {
  console.log(`\n🏥 Starting Automated Health & Route Audit for: ${BASE_URL}\n`)
  let passed = 0
  let failed = 0
  const startTime = Date.now()

  for (const route of ROUTES) {
    const url = `${BASE_URL.replace(/\/$/, "")}${route.path}`
    const startReq = Date.now()
    try {
      const res = await fetch(url, { headers: { "User-Agent": "SlotUrSelf-HealthCheck/1.0" } })
      const duration = Date.now() - startReq
      const text = await res.text()

      if (!res.ok) {
        console.error(`❌ [FAIL] ${route.title} (${route.path}) -> HTTP ${res.status} (${duration}ms)`)
        failed++
        continue
      }

      // Check required contents
      const missingKeywords = route.mustContain.filter(k => !text.includes(k))
      if (missingKeywords.length > 0) {
        console.warn(`⚠️ [WARN] ${route.title} (${route.path}) loaded (HTTP 200, ${duration}ms) but missing expected text: ${missingKeywords.join(", ")}`)
        failed++
      } else {
        console.log(`✅ [PASS] ${route.title.padEnd(30)} -> HTTP 200 (${duration}ms)`)
        passed++
      }
    } catch (err) {
      console.error(`❌ [ERR]  ${route.title} (${route.path}) -> ${err.message}`)
      failed++
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n========================================`)
  console.log(`Test Summary: ${passed} Passed, ${failed} Failed (${totalTime}s total)`)
  console.log(`========================================\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
