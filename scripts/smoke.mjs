const baseUrl = (process.argv[2] || process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

const checks = [
  ['/', 200],
  ['/companies', 200],
  ['/articles', 200],
  ['/ru/companies', 200],
  ['/es/companies', 200],
  ['/robots.txt', 200],
  ['/sitemap.xml', 200],
  ['/api/graphql-playground', 404],
]

let failed = false

for (const [path, expectedStatus] of checks) {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    })
    const passed = response.status === expectedStatus
    console.log(`${passed ? 'PASS' : 'FAIL'} ${path} (${response.status}, expected ${expectedStatus})`)
    failed ||= !passed

    if (path === '/') {
      const requiredHeaders = [
        'content-security-policy',
        'strict-transport-security',
        'x-content-type-options',
      ]
      for (const header of requiredHeaders) {
        const present = response.headers.has(header)
        console.log(`${present ? 'PASS' : 'FAIL'} header ${header}`)
        failed ||= !present
      }
    }
  } catch (error) {
    failed = true
    console.error(`FAIL ${path}`, error instanceof Error ? error.message : error)
  }
}

if (failed) process.exitCode = 1
