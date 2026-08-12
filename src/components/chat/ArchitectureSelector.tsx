import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useArchitecturePreferenceStore } from '@/store/architecturePreference'
import type { ArchitectureType } from '@/api/types'

const ARCHITECTURES: { value: ArchitectureType; label: string; blurb: string }[] = [
  {
    value: 'orchestrator-worker',
    label: 'Orchestrator-Worker',
    blurb: 'A router AI decides what context is needed; a separate writer AI answers using only that.',
  },
  {
    value: 'mcp',
    label: 'MCP',
    blurb: 'The AI calls tools directly and decides for itself, step by step, what to look up.',
  },
]

export function ArchitectureSelector({ compact }: { compact?: boolean }) {
  const { architecture, setArchitecture } = useArchitecturePreferenceStore()
  const active = ARCHITECTURES.find((a) => a.value === architecture) ?? ARCHITECTURES[0]

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {ARCHITECTURES.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => setArchitecture(a.value)}
            aria-pressed={architecture === a.value}
            className={cn(
              'rounded-full border font-medium transition-colors',
              compact ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm',
              architecture === a.value
                ? 'border-signal/60 bg-secondary text-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-signal/40 hover:text-foreground',
            )}
          >
            {a.label}
          </button>
        ))}

        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size={compact ? 'icon-xs' : 'icon-sm'}
                aria-label="What's the difference between these architectures?"
                className="rounded-full text-muted-foreground"
              />
            }
          >
            <Info className={compact ? 'size-3' : 'size-3.5'} />
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choose an architecture</DialogTitle>
              <DialogDescription>
                Two backend pipelines can answer your question. This only changes how the answer gets put
                together, not what Sahib actually knows.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue={architecture}>
              <TabsList className="w-full">
                <TabsTrigger value="orchestrator-worker">Orchestrator-Worker</TabsTrigger>
                <TabsTrigger value="mcp">MCP</TabsTrigger>
              </TabsList>
              <TabsContent value="orchestrator-worker" className="space-y-2 pt-1 text-muted-foreground">
                <p>
                  The default pipeline. An <strong className="text-foreground">Orchestrator</strong> AI reads
                  your question and picks which of Sahib's knowledge domains — resume, GitHub, LeetCode,
                  Codeforces, or personality — are actually relevant. It never answers the question itself.
                </p>
                <p>
                  Once it picks the right domains, a separate <strong className="text-foreground">Worker</strong>{' '}
                  AI gets just that assembled context and writes the reply. Two specialized calls, two jobs: one
                  plans, one answers.
                </p>
              </TabsContent>
              <TabsContent value="mcp" className="space-y-2 pt-1 text-muted-foreground">
                <p>
                  <strong className="text-foreground">MCP (Model Context Protocol)</strong> is an open standard
                  for letting an AI call tools directly, instead of going through a separate planning step. Here
                  the model is handed live tools — GitHub, LeetCode, Codeforces lookups, and more — and decides
                  for itself, turn by turn, which ones to call and what to do with the results.
                </p>
                <p>
                  Because tool-calling and live token streaming don't mix cleanly, MCP replies arrive as one
                  finished answer played back in chunks rather than streamed live — even with streaming turned on
                  — and can take a little longer to respond.
                </p>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {!compact && <p className="max-w-sm text-center text-xs text-muted-foreground">{active.blurb}</p>}
    </div>
  )
}
