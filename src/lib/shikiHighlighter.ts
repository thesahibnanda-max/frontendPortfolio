import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Shiki's default bundle ships every grammar it knows (~5MB+ of chunks) even
// when only a handful are ever used. This app only needs the languages an AI
// answering questions about a backend/competitive-programming portfolio
// would realistically produce, so each is imported explicitly (a Shiki
// "fine-grained bundle") — anything outside this set falls back to plain
// text via `fallbackLanguage: 'text'` in ChatMarkdown rather than pulling in
// the rest of the language registry.
let highlighterPromise: Promise<HighlighterCore> | null = null

export function getSharedHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark')],
      langs: [
        import('@shikijs/langs/javascript'),
        import('@shikijs/langs/typescript'),
        import('@shikijs/langs/jsx'),
        import('@shikijs/langs/tsx'),
        import('@shikijs/langs/python'),
        import('@shikijs/langs/java'),
        import('@shikijs/langs/go'),
        import('@shikijs/langs/rust'),
        import('@shikijs/langs/c'),
        import('@shikijs/langs/cpp'),
        import('@shikijs/langs/csharp'),
        import('@shikijs/langs/sql'),
        import('@shikijs/langs/bash'),
        import('@shikijs/langs/json'),
        import('@shikijs/langs/yaml'),
        import('@shikijs/langs/html'),
        import('@shikijs/langs/css'),
        import('@shikijs/langs/markdown'),
        import('@shikijs/langs/kotlin'),
      ],
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}
