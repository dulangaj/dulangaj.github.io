export const homeSections = {
  hero:       true,
  now:        false,
  featured:   true,
  experience: true,
  writing:    true,
} as const

export type HomeSectionKey = keyof typeof homeSections
