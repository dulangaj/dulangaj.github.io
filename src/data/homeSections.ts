export const homeSections = {
  masthead:   true,
  hero:       true,
  stopPress:  true,
  featured:   true,
  experience: true,
  writing:    true,
} as const

export type HomeSectionKey = keyof typeof homeSections
