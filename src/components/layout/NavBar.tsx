import { NavLink } from 'react-router-dom'
import { PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { useAuthStore } from '@/store/auth'
import { useChatUiStore } from '@/store/chatUi'
import { useProfessionalDetails } from '@/hooks/useDetails'
import { Present } from '@/components/common/Present'

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/stats', label: 'Stats' },
  { to: '/contact', label: 'Contact' },
]

export function NavBar() {
  const isAuthed = useAuthStore((s) => s.token !== null)
  const { data: professional } = useProfessionalDetails()
  const toggleSidebar = useChatUiStore((s) => s.toggleSidebar)
  const setMobileHistoryOpen = useChatUiStore((s) => s.setMobileHistoryOpen)

  const handleToggleHistory = () => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      toggleSidebar()
    } else {
      setMobileHistoryOpen(true)
    }
  }

  return (
    <header className="shrink-0 border-b border-border/80 bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
          <Present value={professional?.profilePhotoLink[0]}>
            {(photo) => (
              <img src={photo} alt="" className="size-7 rounded-full border border-border object-cover" />
            )}
          </Present>
          Sahib Nanda
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'bg-secondary text-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {isAuthed && (
            <Button variant="ghost" size="icon" aria-label="Toggle chat history" onClick={handleToggleHistory}>
              <PanelLeft className="size-4" />
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/80 px-4 py-2 md:hidden">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'shrink-0 rounded-full px-3 py-1 text-sm font-medium text-muted-foreground transition-colors',
                isActive && 'bg-secondary text-foreground',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
