/* ─── Image variants ─────────────────────────────────────────────────────── */
/* WebP copies of public/assets/img/* at fixed widths, written to             */
/* public/assets/img/w/ by vite-plugin-exif at build time.                    */

export const IMAGE_WIDTHS = [480, 960, 1440]
export const AVATAR = { file: 'profile.jpeg', width: 192 }

export function variantUrl(file: string, width: number) {
  return `/assets/img/w/${file.replace(/\.[^.]+$/, '')}-${width}.webp`
}

/* srcset for a top-level /assets/img/ photo; undefined for anything else */
export function srcSetFor(src?: string) {
  const file = src?.match(/^\/assets\/img\/([^/]+\.(?:jpe?g|png))$/i)?.[1]
  return file && IMAGE_WIDTHS.map((w) => `${variantUrl(file, w)} ${w}w`).join(', ')
}
