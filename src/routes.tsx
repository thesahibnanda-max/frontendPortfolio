import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { Landing } from '@/pages/Landing'

// Landing (chat) is the primary entry point and stays eagerly bundled.
// Everything else — including recharts, only used on /stats — code-splits
// per route via React Router's `lazy`, so a first-time visitor chatting on
// "/" never downloads chart/project/skills code they haven't navigated to.
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/about', lazy: () => import('@/pages/About').then((m) => ({ Component: m.About })) },
      { path: '/projects', lazy: () => import('@/pages/Projects').then((m) => ({ Component: m.Projects })) },
      { path: '/skills', lazy: () => import('@/pages/Skills').then((m) => ({ Component: m.Skills })) },
      { path: '/stats', lazy: () => import('@/pages/Stats').then((m) => ({ Component: m.Stats })) },
      { path: '/contact', lazy: () => import('@/pages/Contact').then((m) => ({ Component: m.Contact })) },
    ],
  },
])
