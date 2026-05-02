import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const SITE_URL = 'https://dulangaj.com'
const SITE_NAME = 'Dulanga Jayawardena'
const PERSON_ID = `${SITE_URL}/#person`
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

function buildSitemap(posts, photoLocations) {
  // Use the latest post date for site-level pages (home, writing index).
  // The map page tracks its own freshness from the photo timeline so adding
  // a photo bumps /map's lastmod without touching unrelated pages.
  const today = new Date().toISOString().slice(0, 10)
  const latestPost = posts[0]?.date ?? today
  const latestPhoto = photoLocations
    .map((p) => p.date)
    .filter(Boolean)
    .sort()
    .at(-1) ?? today

  // Note: <changefreq> and <priority> are intentionally omitted. Google has
  // confirmed both are ignored, and maintaining honest values is a chore.
  // <lastmod> is the only freshness signal that matters.
  const entries = [
    { loc: `${SITE_URL}/`, lastmod: latestPost },
    {
      loc: `${SITE_URL}/map`,
      lastmod: latestPhoto,
      // Embed every map photo as <image:image> on the /map URL entry. Per
      // Google's image sitemap docs, images are associated with the page
      // they appear on, not standalone — so they live under /map's <url>.
      images: photoLocations.map((photo) => ({
        loc: `${SITE_URL}${photo.image}`,
        title: photo.title,
        caption: photo.alt,
      })),
    },
    { loc: `${SITE_URL}/writing/`, lastmod: latestPost },
    ...posts.map((post) => ({
      loc: `${SITE_URL}/${post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`,
      lastmod: post.date,
    })),
  ]

  const renderImage = (img) => `    <image:image>
      <image:loc>${escapeHtml(img.loc)}</image:loc>
      <image:title>${escapeHtml(img.title)}</image:title>
      <image:caption>${escapeHtml(img.caption)}</image:caption>
    </image:image>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map((entry) => {
  const imageBlock = entry.images?.length
    ? '\n' + entry.images.map(renderImage).join('\n')
    : ''
  return `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>${imageBlock}
  </url>`
}).join('\n')}
</urlset>
`
}

/** Build a hidden-but-crawlable list of <figure> blocks for every map photo.
 *  Sighted users don't see this (sr-only), but Googlebot reads the alts,
 *  figcaptions, and full-size <img> URLs in the static HTML — solving the
 *  problem that Leaflet markers and the modal only render at runtime. */
function buildPhotoIndexHtml(photoLocations) {
  const items = photoLocations.map((photo) => {
    const credit = photo.photoCredit
      ? `<p>Photo: ${escapeHtml(photo.photoCredit)}</p>`
      : ''
    const description = photo.description
      ? `<p>${escapeHtml(photo.description)}</p>`
      : ''
    return `<figure>
  <img src="${escapeAttribute(photo.image)}" srcset="${escapeAttribute(photo.thumbnail)} 160w, ${escapeAttribute(photo.image)} 1600w" sizes="(max-width: 640px) 100vw, 720px" alt="${escapeAttribute(photo.alt)}" loading="lazy" decoding="async" width="1600" height="1200" />
  <figcaption>
    <h3>${escapeHtml(photo.title)}</h3>
    <p>${escapeHtml(photo.location)} · ${escapeHtml(photo.date)}</p>
    ${description}
    ${credit}
  </figcaption>
</figure>`
  }).join('\n')

  return `<section aria-hidden="false" class="sr-only" id="map-photo-index">
<h2>Photo index — ${photoLocations.length} photos by Dulanga Jayawardena</h2>
<p>This list provides search engines and assistive technologies a static, crawlable inventory of the photographs shown on the interactive map above.</p>
${items}
</section>`
}

/** Schema.org ImageObject array for every map photo, wrapped in a @graph
 *  alongside the existing WebPage entity for /map. */
function mapImageObjectsGraph(photoLocations) {
  const webPage = {
    '@type': 'WebPage',
    '@id': `${getCanonicalUrl('/map')}#webpage`,
    name: 'My World Map',
    description: MAP_DESCRIPTION,
    url: getCanonicalUrl('/map'),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    about: { '@id': PERSON_ID },
  }
  const images = photoLocations.map((photo) => ({
    '@type': 'ImageObject',
    '@id': `${SITE_URL}${photo.image}`,
    contentUrl: `${SITE_URL}${photo.image}`,
    thumbnailUrl: `${SITE_URL}${photo.thumbnail}`,
    name: photo.title,
    caption: photo.alt,
    description: photo.description ?? photo.alt,
    // If the photo is credited to the site owner, point at the canonical
    // Person node so every shot consolidates under one entity. Otherwise
    // (third-party photographer), inline a separate Person.
    creator:
      !photo.photoCredit || photo.photoCredit === SITE_NAME
        ? { '@id': PERSON_ID }
        : { '@type': 'Person', name: photo.photoCredit },
    contentLocation: { '@type': 'Place', name: photo.location },
    datePublished: photo.date,
    isPartOf: { '@id': `${getCanonicalUrl('/map')}#webpage` },
  }))
  return {
    '@context': 'https://schema.org',
    '@graph': [webPage, ...images],
  }
}

function homeStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/assets/img/profile.jpeg`,
    description:
      'Sri Lankan software engineer working on risk technology and analytics for financial market, based in Hong Kong. Photographer and travel writer in side interests.',
    jobTitle: 'Software Engineer',
    email: 'mailto:dulangajay@gmail.com',
    nationality: { '@type': 'Country', name: 'Sri Lanka' },
    knowsAbout: [
      'Technology',
      'Financial Markets',
      'Software Engineering',
      'Photography',
      'Travel Writing',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Engineer',
      occupationalCategory: 'Risk Technology',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Bullish',
      url: 'https://bullish.com',
    },
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'The Chinese University of Hong Kong',
        url: 'https://www.cuhk.edu.hk',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Dartmouth College',
        url: 'https://www.dartmouth.edu',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Elizabeth Moir School',
        url: 'https://www.elizabethmoirschool.com',
      },
      {
        '@type': 'Organization',
        name: 'Morgan Stanley',
        url: 'https://www.morganstanley.com',
      },
    ],
    award: 'Pearson Edexcel Outstanding Learner Award',
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
    about: { '@id': PERSON_ID },
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
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: canonicalUrl,
    image: ogImage,
    articleSection: post.category,
    keywords: post.tags,
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
  const { render, posts, getPostSlug, photoLocations } = ssrModule

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

  // Map page: metadata-only shell, no SSR (Leaflet is client-only).
  // We do, however, inject a hidden-but-crawlable photo index into the body
  // so search engines see every photo's alt + figcaption + full-size URL
  // even though the React tree won't render markers/modals until hydration.
  let mapHtml = applyMetadata(shell, {
    title: MAP_TITLE,
    description: MAP_DESCRIPTION,
    canonicalPath: '/map',
    structuredData: mapImageObjectsGraph(photoLocations),
  }).replace(
    /<p class="app-loading__label" id="app-loading-label">[\s\S]*?<\/p>/,
    '<p class="app-loading__label" id="app-loading-label">Loading map</p>',
  )
  mapHtml = mapHtml.replace(
    /<\/body>/,
    `${buildPhotoIndexHtml(photoLocations)}\n</body>`,
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

  await writeFile('sitemap.xml', buildSitemap(posts, photoLocations))
}

await main()
