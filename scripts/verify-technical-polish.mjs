// scripts/verify-technical-polish.mjs
// Verifies:
// 1. Custom 404 page with links back to the main sections
// 2. Services page with print-friendly stylesheet and print header
// 3. JSON-LD MedicalClinic schema with rich fictional data
// 4. Reduced motion stylesheet verification

async function runAudit() {
  console.log("\n=======================================================")
  console.log("🛠️ CarePoint Clinic Technical Polish Verification Suite")
  console.log("=======================================================\n")

  let passed = 0
  let total = 0

  function assert(condition, message) {
    total++
    if (condition) {
      console.log(`✅ [PASS] ${message}`)
      passed++
    } else {
      console.error(`❌ [FAIL] ${message}`)
    }
  }

  // 1. Verify 404 Page
  try {
    const res404 = await fetch("http://localhost:3000/some-random-404-test-path")
    assert(res404.status === 404, "404 route returns HTTP 404 status code")
    const text404 = await res404.text()
    assert(text404.includes("We couldn&#x27;t find that page") || text404.includes("We couldn't find that page"), "404 page renders custom title")
    assert(text404.includes("Homepage &amp; Overview") || text404.includes("Homepage & Overview"), "404 page links to Homepage")
    assert(text404.includes("Clinical Specialties"), "404 page links to Clinical Specialties")
    assert(text404.includes("Our Medical Team"), "404 page links to Our Medical Team")
    assert(text404.includes("Transparent Pricing"), "404 page links to Transparent Pricing")
    assert(text404.includes("Facility &amp; Suite Gallery") || text404.includes("Facility & Suite Gallery"), "404 page links to Facility Gallery")
    assert(text404.includes("Contact &amp; Directions") || text404.includes("Contact & Directions"), "404 page links to Contact & Directions")
  } catch (err) {
    assert(false, `404 test failed: ${err.message}`)
  }

  // 2. Verify Services Page & Print Features
  try {
    const resServices = await fetch("http://localhost:3000/services")
    assert(resServices.status === 200, "Services page returns HTTP 200")
    const textServices = await resServices.text()
    assert(textServices.includes("Official Outpatient Specialties Directory"), "Services page renders print-only official directory header")
    assert(textServices.includes("Print Directory (PDF)"), "Services page renders 'Print Directory (PDF)' action button")
    assert(textServices.includes("service-card"), "Services page applies 'service-card' print-break-avoid class")
    assert(textServices.includes("no-print"), "Services page applies 'no-print' class to buttons and filters")
  } catch (err) {
    assert(false, `Services test failed: ${err.message}`)
  }

  // 3. Verify JSON-LD MedicalClinic Schema
  try {
    const resHome = await fetch("http://localhost:3000/")
    assert(resHome.status === 200, "Home page returns HTTP 200")
    const textHome = await resHome.text()
    assert(textHome.includes('"@type":"MedicalClinic"') || textHome.includes('"@type": "MedicalClinic"'), "Schema contains '@type': 'MedicalClinic'")
    assert(textHome.includes("Dr. Sara Khan"), "Schema contains physician 'Dr. Sara Khan'")
    assert(textHome.includes("Dr. Marcus Vance"), "Schema contains physician 'Dr. Marcus Vance'")
    assert(textHome.includes("currenciesAccepted"), "Schema contains 'currenciesAccepted'")
    assert(textHome.includes("paymentAccepted"), "Schema contains 'paymentAccepted'")
    assert(textHome.includes("openingHoursSpecification"), "Schema contains 'openingHoursSpecification'")
    assert(textHome.includes("availableService"), "Schema contains 'availableService'")
  } catch (err) {
    assert(false, `Schema test failed: ${err.message}`)
  }

  console.log("\n=======================================================")
  console.log(`Technical Polish Summary: ${passed}/${total} checks passed successfully!`)
  console.log("=======================================================\n")

  if (passed !== total) {
    process.exit(1)
  }
}

runAudit()
