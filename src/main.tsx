import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import './styles/globals.css'
import App from './App'
import { SiteConfig } from '@/models/SiteConfig'

document.documentElement.dataset.motion = SiteConfig.paper.motion

const container = document.getElementById('root')!

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

if (container.dataset.ssr === 'true') {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
