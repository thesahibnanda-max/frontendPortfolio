import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  optimizeDeps: {
    // src/lib/shikiHighlighter.ts fires ~20 deep, conditional-`exports`-map
    // subpath dynamic imports (`@shikijs/themes/*`, `@shikijs/langs/*`) all
    // at once, the first time any chat reply renders. Vite's cold-start dep
    // scanner doesn't reliably discover subpaths like these buried in an
    // array literal, so without this list it treats them as newly
    // discovered mid-session, triggers a re-optimize + reload, and one of
    // the in-flight chunk fetches can race that reload and 404 — surfacing
    // as "Failed to fetch dynamically imported module" and crashing the
    // whole app. Listing them here makes Vite prebundle them synchronously
    // at server startup instead.
    include: [
      '@shikijs/themes/github-light',
      '@shikijs/themes/github-dark',
      '@shikijs/langs/javascript',
      '@shikijs/langs/typescript',
      '@shikijs/langs/jsx',
      '@shikijs/langs/tsx',
      '@shikijs/langs/python',
      '@shikijs/langs/java',
      '@shikijs/langs/go',
      '@shikijs/langs/rust',
      '@shikijs/langs/c',
      '@shikijs/langs/cpp',
      '@shikijs/langs/csharp',
      '@shikijs/langs/sql',
      '@shikijs/langs/bash',
      '@shikijs/langs/json',
      '@shikijs/langs/yaml',
      '@shikijs/langs/html',
      '@shikijs/langs/css',
      '@shikijs/langs/markdown',
      '@shikijs/langs/kotlin',
    ],
  },
})
