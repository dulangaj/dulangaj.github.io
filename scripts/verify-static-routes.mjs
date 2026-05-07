import fs from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')

const REQUIRED_FILES = [
  'index.html',
  'map/index.html',
  'writing/index.html',
  'morgan-stanley-equity-risk/index.html',
  'CNAME',
  '.nojekyll',
]

const ROUTE_CHECKS = [
  {
    pathname: '/',
    expectedTitle: '<title>Dulanga Jayawardena | Software Engineer</title>',
  },
  {
    pathname: '/map/',
    expectedTitle: '<title>My World Map | Dulanga Jayawardena</title>',
  },
  {
    pathname: '/writing/',
    expectedTitle: '<title>Writing Archive | Dulanga Jayawardena</title>',
  },
  {
    pathname: '/morgan-stanley-equity-risk/',
    expectedTitle: '<title>Building Software for Equity Risk at Morgan Stanley | Dulanga Jayawardena</title>',
  },
]

async function assertRequiredFiles() {
  await Promise.all(REQUIRED_FILES.map(async (relativePath) => {
    await fs.access(path.join(DIST_DIR, relativePath))
  }))
}

async function statIfExists(filePath) {
  try {
    return await fs.stat(filePath)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null
    }

    throw error
  }
}

async function resolveAssetPath(pathname) {
  const normalizedPath = decodeURIComponent(pathname)
  const relativePath = normalizedPath.replace(/^\/+/, '')

  const candidates = normalizedPath === '/'
    ? [path.join(DIST_DIR, 'index.html')]
    : [
        path.join(DIST_DIR, relativePath),
        path.join(DIST_DIR, relativePath, 'index.html'),
      ]

  for (const candidate of candidates) {
    const stats = await statIfExists(candidate)
    if (stats?.isFile()) return candidate
  }

  return null
}

function createStaticServer() {
  return http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1')
      const assetPath = await resolveAssetPath(requestUrl.pathname)

      if (!assetPath) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
        response.end('Not found')
        return
      }

      const body = await fs.readFile(assetPath)
      const contentType = assetPath.endsWith('.html')
        ? 'text/html; charset=utf-8'
        : 'application/octet-stream'

      response.writeHead(200, { 'content-type': contentType })
      response.end(body)
    } catch (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
      response.end(error instanceof Error ? error.message : 'Unknown error')
    }
  })
}

async function fetchRoute(baseUrl, { pathname, expectedTitle }) {
  const response = await fetch(new URL(pathname, baseUrl))
  if (!response.ok) {
    throw new Error(`Expected ${pathname} to return HTTP 200, received ${response.status}.`)
  }

  const html = await response.text()
  if (!html.includes(expectedTitle)) {
    throw new Error(`Expected ${pathname} to include ${expectedTitle}.`)
  }
}

async function assertSitemapCanonicalConsistency() {
  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml')
  const sitemap = await fs.readFile(sitemapPath, 'utf8')
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((url) => !url.includes('/assets/'))

  for (const loc of locs) {
    const url = new URL(loc)
    const pathname = url.pathname
    const relative = pathname === '/'
      ? 'index.html'
      : path.join(pathname.replace(/^\/+/, '').replace(/\/+$/, ''), 'index.html')
    const filePath = path.join(DIST_DIR, relative)
    const html = await fs.readFile(filePath, 'utf8').catch(() => null)
    if (!html) {
      throw new Error(`Sitemap loc ${loc} has no matching file at dist/${relative}.`)
    }
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/)
    if (!canonicalMatch) {
      throw new Error(`dist/${relative} is missing a <link rel="canonical">.`)
    }
    if (canonicalMatch[1] !== loc) {
      throw new Error(
        `Canonical mismatch for dist/${relative}: sitemap says ${loc}, page says ${canonicalMatch[1]}.`,
      )
    }
  }
}

async function main() {
  await assertRequiredFiles()
  await assertSitemapCanonicalConsistency()

  const server = createStaticServer()

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })

  const address = server.address()
  if (!address || typeof address === 'string') {
    server.close()
    throw new Error('Could not determine static server address.')
  }

  const baseUrl = `http://127.0.0.1:${address.port}`

  try {
    for (const routeCheck of ROUTE_CHECKS) {
      await fetchRoute(baseUrl, routeCheck)
    }
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }
}

await main()
