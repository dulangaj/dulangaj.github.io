import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'

export interface RenderResult {
  html: string
}

export function render(url: string): RenderResult {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )

  return { html }
}

export { posts } from './data/posts'
export { getPostContent } from './data/postContent'
export { getPostSlug, getPostPath, getPostCanonicalUrl } from './utils/postUrls'
