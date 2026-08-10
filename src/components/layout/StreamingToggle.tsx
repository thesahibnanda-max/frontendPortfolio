import { Zap, ZapOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStreamingPreferenceStore } from '@/store/streamingPreference'

export function StreamingToggle() {
  const { streamingEnabled, toggleStreaming } = useStreamingPreferenceStore()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleStreaming}
      aria-label={streamingEnabled ? 'Turn off streaming responses' : 'Turn on streaming responses'}
    >
      {streamingEnabled ? <Zap className="size-4" /> : <ZapOff className="size-4" />}
    </Button>
  )
}
