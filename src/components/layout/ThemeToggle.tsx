import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={label} />}>
        {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
