const PROMPTS = [
  "What's your Codeforces rating?",
  'Tell me about your latest project',
  'What tech stack do you use most?',
  "What's your LeetCode streak?",
]

export function StarterPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-signal/40 hover:text-foreground"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
