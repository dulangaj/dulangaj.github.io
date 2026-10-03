/* Env vars injected by Vite at build time. */
interface ImportMetaEnv {
  readonly VITE_CARTO_KEY?: string
}

declare const __BUILD_DAY__: string
