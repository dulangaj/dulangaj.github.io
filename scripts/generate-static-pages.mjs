import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SITE_URL = 'https://dulangaj.github.io'
const SITE_NAME = 'Dulanga Jayawardena'
const SITE_TITLE = `${SITE_NAME} | Software Engineer`
const SITE_DESCRIPTION = 'Software engineer building production-grade systems for financial markets across risk technology, analytics, and infrastructure.'
const ROOT_DIR = process.cwd()
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const POSTS_DIR = path.join(ROOT_DIR, 'posts')

function getPostSlug(id) {
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function getPostPath(id) {
  return `/${getPostSlug(id)}/`
}

function getCanonicalUrl(pathname) {
  return new URL(pathname, SITE_URL).toString()
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttribute(value) {
  return escapeHtml(value)
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const result = {}

  for (const line of match[1].split('\n')) {
    const entry = line.match(/^([\w_]+):\s*(.+)$/)
    if (!entry) continue

    const [, key, rawValue] = entry
    const value = rawValue.trim()

    if (value.startsWith('[')) {
      result[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      continue
    }

    if (/^\d+$/.test(value)) {
      result[key] = Number.parseInt(value, 10)
      continue
    }

    result[key] = value.replace(/^["']|["']$/g, '')
  }

  return result
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\r?\n/, '').trim()
}

function stripInlineMarkdown(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\\([\\`*{}[\]()+#\-.!_>~|])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function isExcerptCandidate(paragraph) {
  const trimmed = paragraph.trim()

  if (!trimmed || trimmed.length <= 20) return false
  if (/^#{1,6}\s/.test(trimmed)) return false
  if (/^([-*_])(?:\s*\1){2,}\s*$/.test(trimmed)) return false
  if (/^[>*|]/.test(trimmed)) return false
  if (/^!\[/.test(trimmed)) return false
  if (/^(?:[-+*]\s|\d+\.\s)/.test(trimmed)) return false

  return true
}

function extractExcerpt(body, maxLength = 200) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())

  for (const paragraph of paragraphs) {
    if (!isExcerptCandidate(paragraph)) continue

    const plainText = stripInlineMarkdown(paragraph)
    if (!plainText) continue

    return plainText.length > maxLength
      ? `${plainText.slice(0, maxLength).trimEnd()}...`
      : plainText
  }

  return ''
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function toJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function renderMarkdown(body) {
  return renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        components: {
          img(props) {
            return React.createElement('img', {
              ...props,
              loading: 'lazy',
              decoding: 'async',
            })
          },
        },
      },
      body,
    ),
  )
}

function extractStylesheetHrefs(indexHtml) {
  return [...indexHtml.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((match) => match[1])
}

function buildDocument({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage = `${SITE_URL}/assets/social/og-home.png`,
  structuredData,
  body,
}) {
  const canonicalUrl = getCanonicalUrl(canonicalPath)
  const stylesheetLinks = this.stylesheetHrefs
    .map((href) => `<link rel="stylesheet" href="${escapeAttribute(href)}" />`)
    .join('\n    ')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttribute(description)}" />
    <meta name="author" content="${SITE_NAME}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="theme-color" content="#fafaf8" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#1a1918" media="(prefers-color-scheme: dark)" />
    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta property="og:type" content="${escapeAttribute(ogType)}" />
    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escapeAttribute(title)}" />
    <meta property="og:description" content="${escapeAttribute(description)}" />
    <meta property="og:image" content="${escapeAttribute(ogImage)}" />
    <meta property="og:image:secure_url" content="${escapeAttribute(ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(title)}" />
    <meta name="twitter:description" content="${escapeAttribute(description)}" />
    <meta name="twitter:image" content="${escapeAttribute(ogImage)}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    ${stylesheetLinks}
    <style>
      .static-shell {
        min-height: 100vh;
        padding: 96px 24px 72px;
      }

      .static-shell__inner {
        max-width: 760px;
        margin: 0 auto;
      }

      .static-shell__inner--wide {
        max-width: 920px;
      }

      .static-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 3rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-rule);
      }

      .static-nav__brand,
      .static-nav__link {
        color: var(--color-ink);
        text-decoration: none;
      }

      .static-nav__brand {
        font-family: var(--font-display);
        font-size: 1.1rem;
      }

      .static-nav__link {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .static-nav__links {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .static-kicker,
      .static-meta,
      .static-card__meta {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .static-kicker {
        color: var(--color-crimson);
        margin: 0 0 1rem;
      }

      .static-title {
        margin: 0 0 1.5rem;
        color: var(--color-ink);
        font-family: var(--font-display);
        font-size: clamp(2.4rem, 5vw, 4rem);
        line-height: 1.06;
      }

      .static-summary {
        margin: 0 0 1.5rem;
        color: var(--color-muted);
        font-size: 1rem;
        line-height: 1.8;
      }

      .static-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin: 0 0 2rem;
        color: var(--color-subtle);
      }

      .static-hero {
        width: 100%;
        margin: 0 0 2.5rem;
        border-radius: 12px;
        background: var(--color-rule);
      }

      .static-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        margin: 2.5rem 0 0;
        padding: 2rem 0 0;
        list-style: none;
        border-top: 1px solid var(--color-rule);
      }

      .static-tag {
        display: inline-flex;
        align-items: center;
        padding: 0.38rem 0.7rem;
        border: 1px solid var(--color-rule);
        border-radius: 999px;
        color: var(--color-muted);
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .static-cta {
        margin: 2rem 0 0;
        padding-top: 2rem;
        border-top: 1px solid var(--color-rule);
      }

      .static-cta a,
      .static-footer a,
      .static-card a {
        color: var(--color-crimson);
        text-decoration: none;
      }

      .static-archive {
        display: grid;
        gap: 1.25rem;
        margin-top: 2.5rem;
      }

      .static-card {
        padding: 1.5rem;
        border: 1px solid var(--color-rule);
        border-radius: 12px;
        background: var(--color-surface);
      }

      .static-card__title {
        margin: 0.5rem 0 0.75rem;
        color: var(--color-ink);
        font-family: var(--font-display);
        font-size: 1.55rem;
        line-height: 1.15;
      }

      .static-card__excerpt {
        margin: 0;
        color: var(--color-muted);
        line-height: 1.8;
      }

      .static-footer {
        max-width: 760px;
        margin: 0 auto;
        padding: 0 24px 64px;
        color: var(--color-muted);
        font-size: 0.95rem;
        line-height: 1.7;
      }

      @media (max-width: 720px) {
        .static-shell {
          padding-top: 84px;
          padding-inline: 20px;
        }

        .static-nav {
          align-items: flex-start;
          flex-direction: column;
        }

        .static-title {
          font-size: clamp(2rem, 10vw, 3rem);
        }
      }
    </style>
    <script>
      (function () {
        try {
          var preference = localStorage.getItem('theme-preference');
          if (preference === 'dark' || preference === 'light') {
            document.documentElement.setAttribute('data-theme', preference);
          }
        } catch (error) {}
      })();
    </script>
    <script type="application/ld+json">${toJsonLd(structuredData)}</script>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to content</a>
    ${body}
  </body>
</html>
`
}

function buildArticlePage(post) {
  const canonicalPath = getPostPath(post.id)
  const canonicalUrl = getCanonicalUrl(canonicalPath)
  const ogImage = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/assets/social/og-home.png`
  const description = post.excerpt || post.title
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
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

  const tagsMarkup = post.tags.length > 0
    ? `<ul class="static-tags">${post.tags.map((tag) => `<li class="static-tag">${escapeHtml(tag)}</li>`).join('')}</ul>`
    : ''

  const externalLinkMarkup = post.link
    ? `<p class="static-cta"><a href="${escapeAttribute(post.link)}" target="_blank" rel="noopener noreferrer">View the full project</a></p>`
    : ''

  const heroImageMarkup = post.image
    ? `<img class="static-hero" src="${escapeAttribute(post.image)}" alt="${escapeAttribute(post.title)}" loading="eager" decoding="async" />`
    : ''

  const body = `
    <main id="main-content" class="static-shell">
      <div class="static-shell__inner">
        <header class="static-nav" aria-label="Site">
          <a class="static-nav__brand" href="/">${SITE_NAME}</a>
          <nav class="static-nav__links">
            <a class="static-nav__link" href="/">Home</a>
            <a class="static-nav__link" href="/writing/">Writing</a>
          </nav>
        </header>

        <p class="static-kicker">${escapeHtml(post.category)}</p>
        <h1 class="static-title">${escapeHtml(post.title)}</h1>
        <p class="static-summary">${escapeHtml(description)}</p>
        <p class="static-meta">${[
          escapeHtml(formatDate(post.date)),
          post.subtitle ? escapeHtml(post.subtitle) : '',
          post.readTime ? escapeHtml(`${post.readTime} min read`) : '',
        ].filter(Boolean).join(' | ')}</p>
        ${heroImageMarkup}

        <article class="post-body">
          ${post.bodyHtml}
        </article>

        ${tagsMarkup}
        ${externalLinkMarkup}
      </div>
    </main>

    <footer class="static-footer">
      More writing is available on the <a href="/writing/">archive page</a>. The interactive portfolio and map remain available on the <a href="/">main site</a>.
    </footer>
  `

  return buildDocument.call(this, {
    title: `${post.title} | ${SITE_NAME}`,
    description,
    canonicalPath,
    ogType: 'article',
    ogImage,
    structuredData,
    body,
  })
}

function buildWritingPage(posts) {
  const cards = posts
    .map((post) => `
      <article class="static-card">
        <p class="static-card__meta">${escapeHtml(post.category)} | ${escapeHtml(formatDate(post.date))}</p>
        <h2 class="static-card__title"><a href="${escapeAttribute(getPostPath(post.id))}">${escapeHtml(post.title)}</a></h2>
        <p class="static-card__excerpt">${escapeHtml(post.excerpt || post.title)}</p>
      </article>
    `)
    .join('')

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Writing Archive',
    description: 'Index of articles, project notes, and engineering write-ups by Dulanga Jayawardena.',
    url: getCanonicalUrl('/writing/'),
    about: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  const body = `
    <main id="main-content" class="static-shell">
      <div class="static-shell__inner static-shell__inner--wide">
        <header class="static-nav" aria-label="Site">
          <a class="static-nav__brand" href="/">${SITE_NAME}</a>
          <nav class="static-nav__links">
            <a class="static-nav__link" href="/">Home</a>
          </nav>
        </header>

        <p class="static-kicker">Writing archive</p>
        <h1 class="static-title">Articles, project notes, and field notes.</h1>
        <p class="static-summary">This page exposes the site's long-form content as crawlable HTML, with one permanent URL per article.</p>

        <section class="static-archive" aria-label="Articles">
          ${cards}
        </section>
      </div>
    </main>

    <footer class="static-footer">
      For the full interactive experience, visit the <a href="/">main site</a>.
    </footer>
  `

  return buildDocument.call(this, {
    title: `Writing Archive | ${SITE_NAME}`,
    description: 'Index of articles, project notes, and engineering write-ups by Dulanga Jayawardena.',
    canonicalPath: '/writing/',
    structuredData,
    body,
  })
}

function buildSitemap(posts) {
  const entries = [
    { loc: `${SITE_URL}/`, lastmod: posts[0]?.date ?? '2026-03-09', changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/writing/`, lastmod: posts[0]?.date ?? '2026-03-09', changefreq: 'weekly', priority: '0.9' },
    ...posts.map((post) => ({
      loc: getCanonicalUrl(getPostPath(post.id)),
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

async function readPosts() {
  const files = await fs.readdir(POSTS_DIR)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  const posts = await Promise.all(markdownFiles.map(async (file) => {
    const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8')
    const id = file.replace(/\.md$/, '')
    const frontmatter = parseFrontmatter(raw)
    const body = stripFrontmatter(raw)

    return {
      id,
      title: typeof frontmatter.title === 'string' ? frontmatter.title : id,
      excerpt: extractExcerpt(body),
      date: id.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? '2026-03-09',
      category: typeof frontmatter.category === 'string' ? frontmatter.category : 'Uncategorized',
      subtitle: typeof frontmatter.subtitle === 'string' ? frontmatter.subtitle : '',
      readTime: typeof frontmatter.read_time === 'number' ? frontmatter.read_time : null,
      link: typeof frontmatter.link === 'string' ? frontmatter.link : '',
      author: typeof frontmatter.author === 'string' ? frontmatter.author : SITE_NAME,
      image: typeof frontmatter.image === 'string' ? `/assets/img/${frontmatter.image}` : '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      bodyHtml: renderMarkdown(body),
    }
  }))

  return posts.sort((left, right) => right.date.localeCompare(left.date))
}

async function writeFile(relativePath, content) {
  const destination = path.join(DIST_DIR, relativePath)
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.writeFile(destination, content, 'utf8')
}

async function main() {
  const indexPath = path.join(DIST_DIR, 'index.html')
  const indexHtml = await fs.readFile(indexPath, 'utf8')
  const stylesheetHrefs = extractStylesheetHrefs(indexHtml)

  if (stylesheetHrefs.length === 0) {
    throw new Error('Could not find the built stylesheet in dist/index.html.')
  }

  const posts = await readPosts()
  const context = { stylesheetHrefs }

  for (const post of posts) {
    await writeFile(path.join(getPostSlug(post.id), 'index.html'), buildArticlePage.call(context, post))
  }

  await writeFile(path.join('writing', 'index.html'), buildWritingPage.call(context, posts))
  await writeFile('sitemap.xml', buildSitemap(posts))
}

await main()
