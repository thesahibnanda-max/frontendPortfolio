import { Zap, ZapOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useStreamingPreferenceStore } from '@/store/streamingPreference'

export function StreamingToggle() {
  const { streamingEnabled, toggleStreaming } = useStreamingPreferenceStore()
  const label = streamingEnabled ? 'Turn off streaming responses' : 'Turn on streaming responses'
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={toggleStreaming} aria-label={label} />}>
        {streamingEnabled ? <Zap className="size-4" /> : <ZapOff className="size-4" />}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
