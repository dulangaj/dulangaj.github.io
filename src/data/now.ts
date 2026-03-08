export interface NowItem {
  label: string
  value: string
}

export interface NowConfig {
  items: NowItem[]
}

/* ─── Now Strip Config ───────────────────────────────────────────────────── */
/* This stays data-only so a daily job can update it without touching UI.    */

export const nowConfig: NowConfig = {
  items: [
    { label: 'Based', value: 'Hong Kong' },
    { label: 'Building', value: 'A calmer publishing workflow for this site' },
    { label: 'Thinking about', value: 'Whether OpenClaw can update this strip daily' },
  ],
}
