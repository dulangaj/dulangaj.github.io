/**
 * vite-plugin-exif.ts
 *
 * Build-time Vite plugin that reads EXIF metadata from every image in
 * public/assets/img/ and writes the results to src/data/generatedExif.ts.
 *
 * This runs once when the Vite dev server starts and once at build time.
 * If a photo later gets proper GPS coordinates embedded, it will
 * automatically appear at the right location on the map after the next build.
 */

import type { Plugin } from 'vite'
import { promises as fs } from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import exifr from 'exifr'

interface ExifEntry {
  lat?: number
  lng?: number
  date?: string
  make?: string
  model?: string
  title?: string
  description?: string
}

interface GeneratedPhotoPostLink {
  postId: string
  title: string
}

type ImageTool = 'magick' | 'sips' | 'copy'

const THUMBNAIL_SIZE = 160
const TITLE_TAG_CANDIDATES = ['title', 'XPTitle', 'ObjectName', 'Headline'] as const
const DESCRIPTION_TAG_CANDIDATES = ['description', 'Caption'] as const

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'ignore' })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} exited with code ${code ?? 'unknown'}`))
    })
  })
}

async function commandExists(command: string, args: string[]): Promise<boolean> {
  try {
    await runCommand(command, args)
    return true
  } catch {
    return false
  }
}

async function detectImageTool(): Promise<ImageTool> {
  if (await commandExists('magick', ['-version'])) return 'magick'
  if (await commandExists('sips', ['--help'])) return 'sips'
  return 'copy'
}

async function createThumbnail(inputFile: string, outputFile: string, tool: ImageTool) {
  if (tool === 'magick') {
    await runCommand('magick', [
      inputFile,
      '-auto-orient',
      '-thumbnail',
      `${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE}^`,
      '-gravity',
      'center',
      '-extent',
      `${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE}`,
      outputFile,
    ])
    return
  }

  if (tool === 'sips') {
    await runCommand('sips', [
      '-s',
      'formatOptions',
      '85',
      '--resampleHeightWidth',
      String(THUMBNAIL_SIZE),
      String(THUMBNAIL_SIZE),
      inputFile,
      '--out',
      outputFile,
    ])
    return
  }

  await fs.copyFile(inputFile, outputFile)
}

async function ensureThumbnails(root: string, files: string[]) {
  const imgDir = path.join(root, 'public', 'assets', 'img')
  const thumbDir = path.join(imgDir, 'thumbs')

  await fs.mkdir(thumbDir, { recursive: true })

  const missingFiles = await Promise.all(
    files.map(async (file) => {
      const target = path.join(thumbDir, file)

      try {
        await fs.access(target)
        return null
      } catch {
        return file
      }
    }),
  )

  const missing = missingFiles.filter((file): file is string => file !== null)
  if (missing.length === 0) return

  const tool = await detectImageTool()

  await Promise.all(
    missing.map(async (file) => {
      const source = path.join(imgDir, file)
      const target = path.join(thumbDir, file)

      await createThumbnail(source, target, tool)
    }),
  )

  console.log(`[vite-plugin-exif] Generated ${missing.length} missing thumbnails → public/assets/img/thumbs`)
}

function parseFrontmatterValue(raw: string, key: string): string | null {
  const match = raw.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!match) return null
  return match[1].trim().replace(/^["']|["']$/g, '')
}

function normalizeMetadataText(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const normalized = value.replace(/\s+/g, ' ').trim()
    return normalized || undefined
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const normalized = normalizeMetadataText(item)
      if (normalized) return normalized
    }
    return undefined
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const directValue = normalizeMetadataText(record.value)
    if (directValue) return directValue

    for (const key of ['x-default', 'en-US', 'en-us', 'en', 'default']) {
      const localizedValue = normalizeMetadataText(record[key])
      if (localizedValue) return localizedValue
    }

    for (const [key, candidate] of Object.entries(record)) {
      if (key === 'lang' || key === 'value') continue
      const normalized = normalizeMetadataText(candidate)
      if (normalized) return normalized
    }
  }

  return undefined
}

function firstMetadataText(data: Record<string, unknown>, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = normalizeMetadataText(data[key])
    if (value) return value
  }

  return undefined
}

function firstMeaningfulDescription(data: Record<string, unknown>): string | undefined {
  for (const key of DESCRIPTION_TAG_CANDIDATES) {
    const value = normalizeMetadataText(data[key])
    if (!value) continue
    if (/^[A-Z0-9 .,_-]+$/.test(value) && /\b(?:CAMERA|DIGITAL)\b/.test(value)) continue
    return value
  }

  return undefined
}

function extractDate(data: Record<string, unknown>): string | undefined {
  for (const candidate of [data.DateCreated, data.DateTimeOriginal, data.CreateDate]) {
    if (!candidate) continue

    if (candidate instanceof Date) {
      return candidate.toISOString().slice(0, 10)
    }

    const normalized = String(candidate).trim()
    const isoMatch = normalized.match(/^(\d{4})[-:](\d{2})[-:](\d{2})/)
    if (isoMatch) {
      const [, year, month, day] = isoMatch
      if (year !== '0000' && month !== '00' && day !== '00') {
        return `${year}-${month}-${day}`
      }
    }

    const compactMatch = normalized.match(/^(\d{4})(\d{2})(\d{2})$/)
    if (compactMatch) {
      const [, year, month, day] = compactMatch
      if (year !== '0000' && month !== '00' && day !== '00') {
        return `${year}-${month}-${day}`
      }
    }
  }

  return undefined
}

function collectMarkdownImageFilenames(raw: string): string[] {
  const matches = raw.matchAll(/!\[[^\]]*]\((?:\/assets\/img\/)?([^)\s]+)(?:\s+"[^"]*")?\)/g)
  return Array.from(matches, ([, filename]) => filename)
}

function upsertPhotoPostLink(
  index: Map<string, Map<string, GeneratedPhotoPostLink>>,
  filename: string,
  post: GeneratedPhotoPostLink,
) {
  if (!index.has(filename)) {
    index.set(filename, new Map())
  }

  index.get(filename)!.set(post.postId, post)
}

async function generatePhotoPostLinks(root: string) {
  const postsDir = path.join(root, 'posts')
  const outFile = path.join(root, 'src', 'data', 'generatedPhotoPostLinks.ts')

  let files: string[]
  try {
    files = (await fs.readdir(postsDir))
      .filter((file) => /\.md$/i.test(file))
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return
  }

  const index = new Map<string, Map<string, GeneratedPhotoPostLink>>()

  await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(postsDir, file), 'utf8')
      const postId = file.replace(/\.md$/i, '')
      const title = parseFrontmatterValue(raw, 'title') ?? postId
      const frontmatterImage = parseFrontmatterValue(raw, 'image')
      const imageFilenames = new Set<string>(collectMarkdownImageFilenames(raw))

      if (frontmatterImage) {
        imageFilenames.add(frontmatterImage.replace(/^\/assets\/img\//, ''))
      }

      for (const filename of imageFilenames) {
        upsertPhotoPostLink(index, filename, { postId, title })
      }
    }),
  )

  const body = JSON.stringify(
    Object.fromEntries(
      Array.from(index.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([filename, posts]) => [
          filename,
          Array.from(posts.values()).sort((left, right) => left.postId.localeCompare(right.postId)),
        ]),
    ),
    null,
    2,
  )

  const source = `// Auto-generated by vite-plugin-exif — do not edit manually\n` +
    `// Re-generated each time the dev server starts or a production build runs.\n\n` +
    `export interface GeneratedPhotoPostLink {\n` +
    `  postId: string\n` +
    `  title:  string\n` +
    `}\n\n` +
    `export const generatedPhotoPostLinks: Record<string, GeneratedPhotoPostLink[]> = ${body}\n`

  const current = await fs.readFile(outFile, 'utf8').catch(() => null)
  if (current === source) return

  await fs.writeFile(outFile, source, 'utf8')
  console.log(`[vite-plugin-exif] Wrote post backlink data for ${index.size} images → generatedPhotoPostLinks.ts`)
}

async function extractAndWrite(root: string) {
  const imgDir = path.join(root, 'public', 'assets', 'img')
  const outFile = path.join(root, 'src', 'data', 'generatedExif.ts')

  let files: string[]
  try {
    files = (await fs.readdir(imgDir))
      .filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return // public/assets/img doesn't exist yet during first install
  }

  await ensureThumbnails(root, files)

  const entries: Record<string, ExifEntry> = {}

  await Promise.all(
    files.map(async (file) => {
      try {
        const data = await exifr.parse(path.join(imgDir, file), {
          gps: true,
          ifd0: { pick: ['ImageDescription', 'XPTitle', 'Make', 'Model'] },
          exif: { pick: ['DateTimeOriginal', 'CreateDate'] },
          iptc: { pick: ['ObjectName', 'Headline', 'Caption'] },
          xmp: true,
        })
        if (!data) return

        const entry: ExifEntry = {}
        if (typeof data.latitude === 'number') entry.lat = data.latitude
        if (typeof data.longitude === 'number') entry.lng = data.longitude
        const date = extractDate(data)
        if (date) entry.date = date
        if (data.Make)  entry.make  = String(data.Make).trim()
        if (data.Model) entry.model = String(data.Model).trim()
        const title = firstMetadataText(data, TITLE_TAG_CANDIDATES)
        const description = firstMeaningfulDescription(data)
        if (title) entry.title = title
        if (description) entry.description = description
        if (Object.keys(entry).length === 0) return
        entries[file] = entry
      } catch {
        // Silently skip unreadable files
      }
    }),
  )

  const body = JSON.stringify(
    Object.fromEntries(
      Object.entries(entries).sort(([left], [right]) => left.localeCompare(right)),
    ),
    null,
    2,
  )
  const source = `// Auto-generated by vite-plugin-exif — do not edit manually\n` +
    `// Re-generated each time the dev server starts or a production build runs.\n\n` +
    `export interface ExifEntry {\n` +
    `  lat?:   number\n` +
    `  lng?:   number\n` +
    `  date?:  string   // YYYY-MM-DD\n` +
    `  make?:  string\n` +
    `  model?: string\n` +
    `  title?: string\n` +
    `  description?: string\n` +
    `}\n\n` +
    `export const rawExifData: Record<string, ExifEntry> = ${body}\n`

  const current = await fs.readFile(outFile, 'utf8').catch(() => null)
  if (current === source) return

  await fs.writeFile(outFile, source, 'utf8')
  console.log(`[vite-plugin-exif] Wrote EXIF data for ${files.length} images → generatedExif.ts`)
}

export function exifPlugin(): Plugin {
  return {
    name: 'exif-extract',
    async buildStart() {
      await extractAndWrite(process.cwd())
      await generatePhotoPostLinks(process.cwd())
    },
  }
}
