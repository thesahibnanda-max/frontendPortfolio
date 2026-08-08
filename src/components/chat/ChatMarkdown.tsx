import { useRef, useState, type ComponentProps } from 'react'
import { MarkdownHooks } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import type { Root } from 'hast'
import type { VFile } from 'vfile'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSharedHighlighter } from '@/lib/shikiHighlighter'
import 'katex/dist/katex.min.css'

// Async rehype plugin: waits for the shared fine-grained Shiki highlighter
// (see src/lib/shikiHighlighter.ts) before delegating to its transformer.
// MarkdownHooks (unlike the sync Markdown component) supports async
// rehype/remark plugins, which is exactly why it was chosen here.
function rehypeShikiAsync() {
  return async (tree: Root, file: VFile) => {
    const highlighter = await getSharedHighlighter()
    const transform = rehypeShikiFromHighlighter(highlighter, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      fallbackLanguage: 'text',
    })
    // The real implementation always returns a Promise and never calls
    // `next` (see unified's TransformCallback docs: "you should likely
    // ignore next... promises are easier to reason about") — it's only
    // required by the Transformer type's call signature.
    const result = await transform(tree, file, () => undefined)
    return (result as Root | undefined) ?? tree
  }
}

// markdown -> remark-gfm -> remark-math -> rehype-katex -> shiki -> HTML
const remarkPlugins = [remarkGfm, remarkMath]
const rehypePlugins = [rehypeKatex, rehypeShikiAsync]

function CodeBlock({ children, className, ...props }: ComponentProps<'pre'>) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = ref.current?.innerText ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="group relative">
      <pre ref={ref} className={className} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          'absolute top-2.5 right-2.5 rounded-md border border-border bg-card p-1.5',
          'text-muted-foreground opacity-0 transition-opacity hover:text-foreground',
          'group-hover:opacity-100 focus-visible:opacity-100',
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}

function ExternalLink({ href, children, ...props }: ComponentProps<'a'>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

export function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="prose-chat">
      <MarkdownHooks
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{ pre: CodeBlock, a: ExternalLink }}
        fallback={<div className="h-4 w-2/3 animate-pulse rounded bg-muted" />}
      >
        {content}
      </MarkdownHooks>
    </div>
  )
}
