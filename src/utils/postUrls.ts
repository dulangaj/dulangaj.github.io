export function getPostSlug(id: string): string {
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

export function getPostPath(id: string): string {
  return `/${getPostSlug(id)}/`
}

export function getPostCanonicalUrl(id: string): string {
  return `https://dulangaj.github.io${getPostPath(id)}`
}
