# dulangaj.com

Personal site, set as a newspaper. Live at [dulangaj.com](https://dulangaj.com/). React + Vite, deployed to GitHub Pages on every push to `main`.

```bash
npm install
npm run dev
```

## What's on the wire

- The Stop Press ticker prints live bulletins from a GitHub Gist, one JSON file per feed. A bulletin only prints while its feed is fresh, so stale wires drop off on their own.
- The weather comes from a Pimoroni Enviro+ sensor in my room. Home Assistant reports its temperature and air quality, plus the rain forecast, to the gist.
- Updates on what I'm working on are written to the gist by AI.
- The map plots my photos where they were taken, straight from EXIF GPS, and links each one to the articles it appears in.

## Adding content

- Article: add `posts/YYYY-MM-DD-<slug>.md` with `title` and `category` frontmatter. It's served at `/<slug>/`.
- Photo: drop it in `public/assets/img/`. GPS and Lightroom title/caption are read from EXIF on the next dev start or build. Use `src/data/photoMetadata.ts` for overrides. Never edit the `src/data/generated*.ts` files.
- Copy and settings: `src/models/SiteConfig.ts`.
