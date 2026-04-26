import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const SITE_URL = 'https://dulangaj.com'
const SITE_NAME = 'Dulanga Jayawardena'
const HOME_TITLE = `${SITE_NAME} | Software Engineer`
const HOME_DESCRIPTION = 'Software engineer building production-grade systems for financial markets across risk technology, analytics, and infrastructure.'
const MAP_TITLE = `My World Map | ${SITE_NAME}`
const MAP_DESCRIPTION = 'Interactive world photo map tracing Dulanga Jayawardena’s travels, photography, and related writing.'
const WRITING_TITLE = `Writing Archive | ${SITE_NAME}`
const WRITING_DESCRIPTION = 'Index of articles, project notes, and engineering write-ups by Dulanga Jayawardena.'
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/social/og-home.png`

const ROOT_DIR = process.cwd()
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const SSR_BUNDLE_PATH = path.join(ROOT_DIR, 'dist-ssr', 'entry-server.js')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttribute(value) {
  return escapeHtml(value)
}

function getCanonicalUrl(pathname) {
  return new URL(pathname, SITE_URL).toString()
}

function toJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function replaceFirst(source, pattern, replacement, label) {
  if (!pattern.test(source)) {
    throw new Error(`prerender: could not find ${label} in dist/index.html.`)
  }

  return source.replace(pattern, replacement)
}

function applyMetadata(template, {
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  structuredData,
}) {
  const canonicalUrl = getCanonicalUrl(canonicalPath)
  let html = template

  html = replaceFirst(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`, 'document title')
  html = replaceFirst(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttribute(description)}" />`, 'description meta')
  html = replaceFirst(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`, 'canonical link')
  html = replaceFirst(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${escapeAttribute(ogType)}" />`, 'og:type')
  html = replaceFirst(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />`, 'og:url')
  html = replaceFirst(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttribute(title)}" />`, 'og:title')
  html = replaceFirst(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttribute(description)}" />`, 'og:description')
  html = replaceFirst(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeAttribute(ogImage)}" />`, 'og:image')
  html = replaceFirst(html, /<meta property="og:image:secure_url" content="[^"]*" \/>/, `<meta property="og:image:secure_url" content="${escapeAttribute(ogImage)}" />`, 'og:image:secure_url')
  html = replaceFirst(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeAttribute(title)}" />`, 'twitter:title')
  html = replaceFirst(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeAttribute(description)}" />`, 'twitter:description')
  html = replaceFirst(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${escapeAttribute(ogImage)}" />`, 'twitter:image')

  if (structuredData) {
    html = replaceFirst(
      html,
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${toJsonLd(structuredData)}</script>`,
      'structured data block',
    )
  }

  return html
}

function injectSsrIntoRoot(template, bodyHtml) {
  const pattern = /<div id="root">[\s\S]*?<\/div>(?=\s*<noscript>)/
  if (!pattern.test(template)) {
    throw new Error('prerender: could not locate <div id="root"> in dist/index.html.')
  }
  return template.replace(pattern, `<div id="root" data-ssr="true">${bodyHtml}</div>`)
}

function buildSitemap(posts) {
  const latest = posts[0]?.date ?? new Date().toISOString().slice(0, 10)
  const entries = [
    { loc: `${SITE_URL}/`, lastmod: latest, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/map`, lastmod: latest, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_URL}/writing/`, lastmod: latest, changefreq: 'weekly', priority: '0.9' },
    ...posts.map((post) => ({
      loc: `${SITE_URL}/${post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`,
      lastmod: post.date,
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
}

function homeStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    jobTitle: 'Software Engineer',
    email: 'mailto:dulangajay@gmail.com',
    sameAs: [
      'https://github.com/dulangaj',
      'https://linkedin.com/in/dulangaj',
    ],
  }
}

function writingStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Writing Archive',
    description: WRITING_DESCRIPTION,
    url: getCanonicalUrl('/writing/'),
    about: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

function articleStructuredData(post, canonicalUrl, ogImage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: canonicalUrl,
    image: ogImage,
    articleSection: post.category,
    keywords: post.tags,
  }
}

function mapStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'My World Map',
    description: MAP_DESCRIPTION,
    url: getCanonicalUrl('/map'),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

async function writeFile(relativePath, content) {
  const destination = path.join(DIST_DIR, relativePath)
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.writeFile(destination, content, 'utf8')
}

async function main() {
  const indexPath = path.join(DIST_DIR, 'index.html')
  const shell = await fs.readFile(indexPath, 'utf8')

  const ssrModule = await import(pathToFileURL(SSR_BUNDLE_PATH).href)
  const { render, posts, getPostSlug } = ssrModule

  if (typeof render !== 'function') {
    throw new Error('prerender: SSR bundle is missing a render() export.')
  }

  // Home: replace dist/index.html with SSR'd home page
  const homeRender = render('/')
  let homeHtml = applyMetadata(shell, {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    canonicalPath: '/',
    structuredData: homeStructuredData(),
  })
  homeHtml = injectSsrIntoRoot(homeHtml, homeRender.html)
  await writeFile('index.html', homeHtml)

  // Writing archive
  const writingRender = render('/writing/')
  let writingHtml = applyMetadata(shell, {
    title: WRITING_TITLE,
    description: WRITING_DESCRIPTION,
    canonicalPath: '/writing/',
    structuredData: writingStructuredData(),
  })
  writingHtml = injectSsrIntoRoot(writingHtml, writingRender.html)
  await writeFile(path.join('writing', 'index.html'), writingHtml)

  // Map page: metadata-only shell, no SSR (Leaflet is client-only)
  const mapHtml = applyMetadata(shell, {
    title: MAP_TITLE,
    description: MAP_DESCRIPTION,
    canonicalPath: '/map',
    structuredData: mapStructuredData(),
  }).replace(
    /<p class="app-loading__label" id="app-loading-label">[\s\S]*?<\/p>/,
    '<p class="app-loading__label" id="app-loading-label">Loading map</p>',
  )
  await writeFile(path.join('map', 'index.html'), mapHtml)

  // One file per article, fully SSR'd
  for (const post of posts) {
    const slug = getPostSlug(post.id)
    const canonicalPath = `/${slug}/`
    const canonicalUrl = getCanonicalUrl(canonicalPath)
    const ogImage = post.image ? `${SITE_URL}${post.image}` : DEFAULT_OG_IMAGE
    const description = post.excerpt || post.title

    const articleRender = render(canonicalPath)
    let articleHtml = applyMetadata(shell, {
      title: `${post.title} | ${SITE_NAME}`,
      description,
      canonicalPath,
      ogType: 'article',
      ogImage,
      structuredData: articleStructuredData(post, canonicalUrl, ogImage),
    })
    articleHtml = injectSsrIntoRoot(articleHtml, articleRender.html)
    await writeFile(path.join(slug, 'index.html'), articleHtml)
  }

  await writeFile('sitemap.xml', buildSitemap(posts))
}

await main()
