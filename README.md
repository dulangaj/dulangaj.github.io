# dulangaj.github.io

Personal portfolio site. Live at [dulangaj.github.io](https://dulangaj.github.io/).

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Animation | Framer Motion |
| Routing | React Router v7 (HashRouter — works on GitHub Pages) |
| Markdown | react-markdown + remark-gfm |
| Hosting | GitHub Pages via Actions (`/.github/workflows/deploy.yml`) |

## Design tokens

### Fonts

The site loads these Google Fonts in `index.html` and maps them to CSS tokens in `src/styles/globals.css`:

| Token | Font stack | Usage |
|---|---|---|
| `--font-display` | `'Playfair Display', Georgia, serif` | Editorial headings |
| `--font-body` | `'Inter', system-ui, sans-serif` | Body copy and UI text |
| `--font-mono` | `'JetBrains Mono', 'Courier New', monospace` | Code, labels, metadata |

### Colors

Site-wide color tokens are defined in `src/styles/globals.css`.

#### Light mode

| Token | Value | Usage |
|---|---|---|
| `--color-paper` | `#fafaf8` | Page background |
| `--color-surface` | `#ffffff` | Cards and elevated surfaces |
| `--color-ink` | `#1a1a1a` | Primary text |
| `--color-muted` | `#6b6b6b` | Secondary text |
| `--color-subtle` | `#a8a8a4` | Tertiary text and placeholders |
| `--color-rule` | `#e5e5e0` | Borders and dividers |
| `--color-crimson` | `#dc2626` | Primary accent |
| `--color-crimson-hover` | `#b91c1c` | Accent hover state |

#### Dark mode

| Token | Value | Usage |
|---|---|---|
| `--color-paper` | `#1a1918` | Page background |
| `--color-surface` | `#242220` | Cards and elevated surfaces |
| `--color-ink` | `#ede9e3` | Primary text |
| `--color-muted` | `#9b938a` | Secondary text |
| `--color-subtle` | `#5e5750` | Tertiary text and placeholders |
| `--color-rule` | `#2e2a26` | Borders and dividers |
| `--color-crimson` | `#e05252` | Primary accent |
| `--color-crimson-hover` | `#ef6e6e` | Accent hover state |

#### Additional map-specific colors

These are used directly in the map UI outside the core token set:

| Value | Usage |
|---|---|
| `#94a3b8` | Light-mode cluster spider leg stroke |
| `#64748b` | Dark-mode cluster spider leg stroke |
| `#ef4444` | Active/hover marker ring |
| `#fff` / `rgba(255,255,255,0.9)` | Map overlay and active text |
| `rgba(0,0,0,0.5)` | Map overlay scrim |

## Running locally

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run lint      # ESLint
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## What the app contains

- Home page with Hero, Featured work, Experience, and Writing sections
- Individual article pages rendered from markdown
- A full-screen interactive photo map at `#/map`
- Light and dark themes with user preference persistence
- Build-time content generation for post metadata, EXIF data, image thumbnails, and photo-to-post backlinks

## Routes

| Route | Purpose |
|---|---|
| `#/` | Home page |
| `#/post/:id` | Post or project detail page |
| `#/map` | Interactive world photo map |

## Content and configuration

### Site identity and navigation

Edit `src/models/SiteConfig.ts` for the site-wide identity:

- name, title, tagline, bio
- location and email
- header navigation items
- footer and hero social links

### Section visibility

Edit `src/data/homeSections.ts` to toggle homepage sections on or off.

The optional “Now” strip is configured in `src/data/now.ts` and rendered only when `homeSections.now` is `true`.

### Writing and project content

All long-form content now lives in `posts/*.md`. `src/data/postContent.ts` loads those files with Vite, parses frontmatter, strips the frontmatter from the body, and auto-generates excerpts from the first prose paragraph.

The file name is the post ID and route slug, so a file named:

```text
posts/2025-05-01-morgan-stanley-equity-risk.md
```

becomes:

- post id: `2025-05-01-morgan-stanley-equity-risk`
- route: `#/post/2025-05-01-morgan-stanley-equity-risk`
- publish date: `2025-05-01` (derived from the filename prefix)

Supported frontmatter fields currently used by the app:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Display title |
| `category` | `string` | Yes | Section label, such as `Work` or `Engineering` |
| `subtitle` | `string` | No | Secondary byline |
| `tags` | `string[]` | No | Rendered on the detail page |
| `image` | `string` | No | Filename inside `public/assets/img/` |
| `read_time` | `number` | No | Minutes |
| `link` | `string` | No | External CTA on the detail page |

Example:

```markdown
---
layout: post
title: "My New Project"
category: Engineering
subtitle: Personal Project
tags: [React, TypeScript]
image: my-new-project.jpeg
read_time: 5
link: https://github.com/example/my-new-project
---

## Overview

Write the article in markdown. Tables, images, code fences, and GFM all work.
```

Notes:

- `layout`, `author`, and similar extra frontmatter fields can exist, but the app currently reads only the fields listed above.
- The Writing section shows every markdown post, newest first.
- Excerpts are auto-generated; there is no manual excerpt field in markdown today.

### Featured work

The Featured section on the home page is curated in `src/data/featuredConfig.ts`.

- Each entry must reference an existing markdown post by filename stem / post ID.
- `featuredConfig` controls the Featured section order.
- It can override the excerpt and image used on the homepage without changing the underlying post.

### Experience

Edit `src/data/experiences.ts`. Each item is an `Experience` model with:

- `id`, `role`, `company`, `location`
- `period`, `startYear`, `endYear`
- `description`, `highlights`, `tags`
- optional `image`

### Photos and the map

The map is powered by `src/pages/MapPage.tsx` and the merged photo dataset in `src/data/photoLocations.ts`.

To add a new photo:

1. Put the original file in `public/assets/img/`.
2. Run `npm run dev` or `npm run build`.
3. The Vite EXIF plugin will:
   - read EXIF data from images
   - extract embedded title/caption metadata (for example Lightroom XMP `title` and `description`)
   - generate `src/data/generatedExif.ts`
   - create missing thumbnails in `public/assets/img/thumbs/`
   - generate `src/data/generatedPhotoPostLinks.ts` by scanning markdown posts for image usage
4. Add or update a matching entry in `src/data/photoMetadata.ts` if you want:
   - fallback coordinates when GPS is missing
   - to override the embedded title or description, or add a subtitle
   - a human-readable location label
   - category and description overrides
   - suppression of generated post backlinks

Notes:

- `src/data/generatedExif.ts` and `src/data/generatedPhotoPostLinks.ts` are generated files. Do not edit them manually.
- Photos with embedded GPS data appear on the map automatically after the next dev start or build.
- The hero profile image is a normal asset at `public/assets/img/profile.jpeg`.

## Build and deployment behavior

- `npm run dev` starts Vite and also runs the EXIF/backlink generation plugin at startup.
- `npm run build` runs `tsc -b` and then the Vite production build.
- CI in `.github/workflows/ci.yml` runs lint and build on pushes to `main` and pull requests.
- Deployment in `.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages.

## Data sources

| File | What it controls |
|---|---|
| `src/models/SiteConfig.ts` | Site identity, nav, and socials |
| `src/data/homeSections.ts` | Which homepage sections render |
| `src/data/now.ts` | “Now” strip items |
| `posts/*.md` | Writing and project content |
| `src/data/featuredConfig.ts` | Featured section order and curated homepage excerpts |
| `src/data/experiences.ts` | Experience timeline |
| `src/data/photoMetadata.ts` | Manual photo labels, coordinates, categories, and descriptions |
| `src/data/generatedExif.ts` | Auto-generated EXIF metadata |
| `src/data/generatedPhotoPostLinks.ts` | Auto-generated photo-to-post backlinks |
| `public/assets/img/` | Source images, including `profile.jpeg` |
| `public/assets/img/thumbs/` | Auto-generated map thumbnails |

## Project structure

```text
.
├── .github/workflows/      # CI and GitHub Pages deployment
├── posts/                  # Markdown posts loaded at build time
├── public/
│   ├── assets/img/         # Source images and profile photo
│   ├── assets/social/      # OG/social card templates and rendered assets
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── layout/         # Header and footer
│   │   ├── sections/       # Hero, Featured, Experience, Writing
│   │   └── ui/             # Shared animated/editorial UI primitives
│   ├── data/               # Content config, generated metadata, loaders
│   ├── hooks/              # Theme and scroll helpers
│   ├── models/             # SiteConfig, Post, Experience
│   ├── pages/              # Post detail and map routes
│   ├── styles/             # Global Tailwind v4 tokens and app styles
│   ├── App.tsx
│   └── main.tsx
├── index.html              # HTML shell and font loading
├── vite-plugin-exif.ts     # Build-time EXIF/thumb/backlink generation
└── vite.config.ts          # Vite config and aliases
```
