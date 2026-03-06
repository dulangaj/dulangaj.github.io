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

## Running locally

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

---

## How to update content

### 1. Personal info, name, bio, nav, socials

Edit `src/models/SiteConfig.ts`. This is the single config object for site-wide identity:

```ts
export const SiteConfig = new SiteConfigClass({
  name:     'Dulanga Jayawardena',
  title:    'Software Engineer',
  tagline:  'Building scalable systems for financial markets.',
  bio:      '...',
  location: 'Hong Kong',
  email:    'dulangajay@gmail.com',
  nav:      [...],
  socials:  [...],
})
```

### 2. Posts (Writing section) and Projects (Selected Work)

All content lives in one file: **`src/data/posts.ts`**

Each entry is a `Post` object. Fields:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique slug used in the URL (`/post/:id`) |
| `title` | `string` | Displayed headline |
| `excerpt` | `string` | Short teaser shown on cards |
| `date` | `string` | ISO date (`YYYY-MM-DD`) — controls ordering |
| `category` | `string` | Label shown on cards (e.g. `'Work'`, `'Research'`) |
| `image` | `string?` | Path to image in `public/assets/img/` |
| `readTime` | `number?` | Minutes — shown as "X min read" |
| `link` | `string?` | External URL shown as CTA on detail page |
| `file` | `string?` | Markdown filename stem in `_posts/` (see below) |
| `featured` | `boolean?` | `true` → appears in Selected Work section |
| `subtitle` | `string?` | Company/institution shown as byline |
| `tags` | `string[]?` | Tech tags shown on project cards |

**To add a new project:**

```ts
new Post({
  id:       'my-new-project',
  title:    'My New Project',
  excerpt:  'One sentence that makes someone want to read more.',
  date:     '2025-01-15',
  category: 'Engineering',
  image:    '/assets/img/my-photo.jpg',
  readTime: 5,
  file:     '2025-01-15-my-new-project',   // links to _posts/ markdown
  featured: true,                           // shows in Selected Work
  subtitle: 'Company Name',
  tags:     ['Python', 'React'],
  link:     'https://github.com/dulangaj/my-project',
}),
```

Posts with `featured: true` appear in **both** Selected Work and Writing. Posts without `featured` only appear in Writing.

### 3. Adding full article content

For each post, create a corresponding markdown file in **`_posts/`**:

```
_posts/2025-01-15-my-new-project.md
```

The filename stem (without `.md`) must match the `file` field in `posts.ts`.

**File format:**

```markdown
---
layout: post
title: "My New Project"
---

## Overview

Full article content here. Supports standard markdown, tables, images,
code blocks. The frontmatter block is stripped automatically.
```

If no `file` is set, the detail page shows the `excerpt` as a pull quote instead.

### 4. Experience section

Edit **`src/data/experiences.ts`**:

```ts
new Experience({
  id:          'my-company',
  role:        'Senior Engineer',
  company:     'Company Name',
  location:    'City, Country',
  period:      '2023 – 2025',
  startYear:   2023,
  endYear:     2025,           // omit if current role
  description: 'One or two sentences.',
  highlights:  [
    'Bullet point achievement one',
    'Bullet point achievement two',
  ],
  tags:  ['Java', 'Kafka'],
  image: '/assets/img/company-photo.jpg',  // optional
})
```

### 5. Profile photo

Drop a file at **`public/profile.jpg`**. The Hero section displays it in a circular frame with a crimson accent ring. If absent, the initials "DJ" show as a fallback.

### 6. Images

Place images in **`public/assets/img/`** and reference them as `/assets/img/filename.jpg`.

---

## Data sources

| File | What it controls |
|---|---|
| `src/models/SiteConfig.ts` | Name, bio, tagline, nav links, social links |
| `src/data/posts.ts` | All posts and projects (single source of truth) |
| `src/data/experiences.ts` | Work experience timeline |
| `_posts/*.md` | Full article body for each post |
| `public/assets/img/` | All images |
| `public/profile.jpg` | Hero profile photo |

---

## Project structure

```
.
├── _posts/              # Markdown article bodies (loaded at build time via Vite glob)
├── public/assets/img/   # Images referenced by posts and experiences
├── public/              # Static assets served as-is (place profile.jpg here)
├── src/
│   ├── components/
│   │   ├── layout/      # Header, Footer
│   │   ├── sections/    # Hero, Projects, Experience, Writing
│   │   └── ui/          # FadeIn, Tag, SectionLabel
│   ├── data/            # posts.ts, experiences.ts, postContent.ts
│   ├── hooks/           # useScrollProgress
│   ├── models/          # Post, Experience, SiteConfig
│   ├── pages/           # PostDetail page
│   └── styles/          # globals.css (Tailwind v4 + design tokens)
├── index.html           # Vite entry point
└── vite.config.ts
```
