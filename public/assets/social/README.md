# Social Card

This folder contains the homepage share card used by Open Graph and Twitter metadata.

## Files

- `og-home.html`: Source layout for the card. This is the editable version.
- `og-home.png`: Exported `1200x630` image used by the site preview metadata.
- `render-social-card.mjs`: Local renderer that exports the PNG directly from the HTML file.

## How it works

The site metadata in `/index.html` points to `/assets/social/og-home.png`.

The PNG is not hand-drawn or generated at build time. It is rendered from `og-home.html` in a real browser so spacing, typography, and image cropping match what Chromium actually paints.

The renderer opens the HTML file directly with Playwright over `file://`, so you do not need to start the Vite dev server just to refresh the card.

## Update the card

1. Edit `og-home.html`.
2. Export the PNG:

```bash
node public/assets/social/render-social-card.mjs
```

If you prefer, you can make it executable and run it directly:

```bash
./public/assets/social/render-social-card.mjs
```

## Notes

- Keep the exported image at exactly `1200x630`.
- The card uses `../img/profile.jpeg` as its portrait source so it works both in local file rendering and when served by the site.
- If the preview image changes, commit the regenerated `og-home.png` along with any metadata changes in `/index.html`.
- Playwright is only a local rendering tool for regenerating the asset. The deployed site only needs the final PNG.
