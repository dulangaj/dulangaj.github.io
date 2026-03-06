#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const inputName = process.argv[2] ?? 'og-home.html'
const outputName = process.argv[3] ?? inputName.replace(/\.html$/i, '.png')
const inputPath = path.resolve(__dirname, inputName)
const outputPath = path.resolve(__dirname, outputName)

const browser = await chromium.launch()

try {
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 630,
    },
    deviceScaleFactor: 1,
  })

  await page.goto(pathToFileURL(inputPath).href, {
    waitUntil: 'load',
  })

  await page.waitForFunction(() => {
    const image = document.querySelector('.portrait-panel img')
    return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
  })

  await page.screenshot({
    path: outputPath,
  })

  console.log(`Rendered ${path.basename(outputPath)} from ${path.basename(inputPath)}`)
} finally {
  await browser.close()
}
