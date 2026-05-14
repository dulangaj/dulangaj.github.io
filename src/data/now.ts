export interface NowItem {
  label: string
  value: string
}

export interface NowConfig {
  items: NowItem[]
}

/* ─── Stop Press Bulletins ───────────────────────────────────────────────── */
/* Late field reports that print along the top of the page before deadline.   */
/* This file is data-only so the bureau editor can update it without touching */
/* layout.                                                                     */

export const nowConfig: NowConfig = {
  items: [
    { label: 'Filed from',  value: 'Hong Kong' },
    { label: 'On the desk', value: 'A calmer publishing workflow for this paper' },
    { label: 'In the wire', value: 'Notes from the equity-risk beat' },
  ],
}
