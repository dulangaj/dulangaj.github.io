# Personal site

View the live build at [dulangaj.github.io](https://dulangaj.github.io/).

The site still runs on GitHub Pages' default Jekyll stack but swaps the Millennial starter for a bespoke, Apple-inspired layout with WebP media, lazy-loaded cards, and a dark-mode friendly palette.

## Local development

```sh
bundle install
bundle exec jekyll serve
```

## Updating content

- Navigation + social links live in `_data/settings.yml`.
- Selected Work cards are defined in `_data/work.yml` so new case studies only require data changes.
- Images should have both `.webp` and fallback formats inside `assets/img/`. Placeholders lazy-load by default, so keep file sizes lean for best Lighthouse scores.
