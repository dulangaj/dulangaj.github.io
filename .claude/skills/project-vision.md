# Portfolio Site — Project Vision

## Aesthetic: Editorial Magazine
High-end tech journalism. Think *MIT Technology Review* meets *The Economist* digital.
Target audience: fintech/finance professionals.

## Design Principles
- **Typography-first** — type hierarchy carries the layout, not decoration
- **Generous whitespace** — restraint signals quality
- **Print paradigm** — grid, columns, and spacing decisions should feel like a physical broadsheet
- **Light** — predominantly light backgrounds; darkness used sparingly for contrast

## Layout Patterns
- Horizontal scroll section for the experience timeline
- Parallax depth on scroll
- Smooth page transitions between sections/routes

## Motion (Framer Motion)
- Scroll-triggered reveals
- Staggered text entrances
- Hover depth effects
- Smooth page transitions
- Motion should feel *purposeful*, never decorative

## Technology Stack
| Layer | Tool |
|---|---|
| Styling | Tailwind v3 |
| Animation | Framer Motion |
| Language | TypeScript |
| Bundler | Vite |

## Architecture (OOP)
```
src/
  models/      # Typed classes (Experience, Project, etc.) — the domain layer
  data/        # Content files — the CMS layer, no business logic
  components/
    layout/    # Page shells, grids, wrappers
    sections/  # Full page sections (Hero, Timeline, etc.)
    ui/        # Atomic reusable elements (Button, Tag, Card, etc.)
```

## Core Principles
1. **Content is segregated from technology** — swap data/ without touching components
2. **Codebase looks good** — clean OOP, no god files, single responsibility
3. **Easy maintainability** — new experience or project = add an entry to data/, nothing else
