// scripts/verify-20-checklist.mjs
const BASE_URL = process.argv[2] || "http://localhost:3000"

async function testEndpoint(path, expectedChecks = []) {
  const url = `${BASE_URL}${path}`
  try {
    const res = await fetch(url)
    const text = await res.text()
    if (!res.ok) {
      console.error(`❌ [HTTP ${res.status}] ${path}`)
      return false
    }

    let allChecksPassed = true
    for (const check of expectedChecks) {
      if (!text.includes(check)) {
        console.error(`❌ [CHECK FAILED] ${path} missing: "${check}"`)
        allChecksPassed = false
      }
    }

    if (allChecksPassed) {
      console.log(`✅ [PASS] ${path.padEnd(25)} -> HTTP 200 (${text.length} bytes)`)
      return true
    }
    return false
  } catch (err) {
    console.error(`❌ [FETCH ERROR] ${path}: ${err.message}`)
    return false
  }
}

async function run() {
  console.log(`\n🏥 Running CarePoint Clinic 20-Point UX & Production Audit against ${BASE_URL}...\n`)

  const tests = [
    {
      path: "/",
      checks: [
        "CarePoint Clinic",
        "Skip to content",
        "Search CarePoint services",
        "CareNovaNavbar",
        "MedicalClinic",
      ]
    },
    {
      path: "/about",
      checks: ["CarePoint", "About"]
    },
    {
      path: "/services",
      checks: ["CarePoint", "Services"]
    },
    {
      path: "/pricing",
      checks: ["CarePoint", "Predictable costs"]
    },
    {
      path: "/security",
      checks: ["CarePoint", "Row level security"]
    },
    {
      path: "/contact",
      checks: ["CarePoint", "Contact &amp; Location", "Get in Touch"]
    },
    {
      path: "/login",
      checks: ["Welcome Back", "Log in to access your appointments"]
    },
    {
      path: "/signup",
      checks: ["How would you like to join?", "Patient", "Doctor"]
    },
    {
      path: "/privacy",
      checks: ["Privacy Policy", "CarePoint Clinic"]
    },
    {
      path: "/terms",
      checks: ["Terms of Service", "CarePoint Clinic"]
    },
    {
      path: "/sitemap.xml",
      checks: ["<urlset", "https://carepointclinic.com/"]
    },
    {
      path: "/robots.txt",
      checks: ["User-agent: *", "Sitemap: https://carepointclinic.com/sitemap.xml"]
    },
    {
      path: "/llms.txt",
      checks: ["CarePoint Clinic", "https://carepointclinic.com"]
    }
  ]

  let passed = 0
  for (const t of tests) {
    const success = await testEndpoint(t.path, t.checks)
    if (success) passed++
  }

  console.log(`\n========================================`)
  console.log(`Result: ${passed}/${tests.length} tests passed successfully!`)
  console.log(`========================================\n`)

  if (passed !== tests.length) {
    process.exit(1)
  }
}

run()
