# frontendPortfolio

A chat-first personal portfolio. Instead of scrolling through static About /
Projects / Skills sections, visitors land directly in a chat interface and
talk to an AI that answers questions about the owner — background, projects,
skills, and live coding stats pulled from LeetCode, Codeforces, and GitHub.
Traditional portfolio pages still exist for browsing, but the chat is the
primary experience.

Built with React 19, TypeScript, and Vite, styled with Tailwind CSS v4 and
shadcn-style components, and backed by a separate Spring Boot API
([backendPortfolio](https://github.com/thesahibnanda-max)).

## Features

- **AI chat landing page** — the `/` route is a full chat UI (Claude/ChatGPT-style),
  not a hero banner. Browsing the rest of the portfolio is always free and
  unauthenticated; signing up / logging in is only required to *send* a
  message.
- **Inline data touchpoints** — when the assistant references real data
  (a project, a stat, a skill), it renders as a rich inline card under the
  message rather than a plain citation link.
- **Live coding stats** — GitHub, LeetCode, and Codeforces stats/charts
  (rating history, difficulty breakdown) rendered with Recharts.
- **Chat history** — multiple chats, renaming, and search, persisted per
  authenticated user.
- **Route-level code splitting** — only the landing/chat page is eagerly
  bundled; About, Projects, Skills, Stats, and Contact (and their chart
  dependencies) are lazy-loaded via React Router so a first-time visitor
  never downloads code they don't visit.
- **Light/dark theme**, markdown + KaTeX math + syntax-highlighted code
  rendering in chat messages.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript, built with Vite |
| Routing | React Router v7 (lazy route modules) |
| Styling | Tailwind CSS v4, `class-variance-authority`, `tailwind-merge` |
| Components | shadcn-style primitives on top of Base UI |
| State | Zustand (auth, chat UI state) |
| Data fetching | TanStack Query |
| Markdown/Math | `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, Shiki |
| Charts | Recharts |
| Motion | Motion (Framer Motion successor) |
| Lint | Oxlint |

## Getting started

### Prerequisites

- Node.js 20+
- A running instance of [backendPortfolio](https://github.com/thesahibnanda-max)
  (or the hosted stage API)

### Setup

```bash
npm install
cp .env.example .env   # then fill in VITE_API_BASE_URL
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Base URL of the backendPortfolio API, **no trailing slash and no path prefix** — endpoints live at their exact root path (e.g. `/details/leetcode`). The app throws at startup if this is unset. |

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Project structure

```
src/
├── api/            # Typed fetch wrappers for the backend (auth, chats, details)
├── components/
│   ├── chat/       # Chat UI: message list, input, sidebar, history, auth gate modal
│   ├── cards/      # Project cards, inline data touchpoint cards
│   ├── charts/     # Codeforces rating chart, LeetCode difficulty donut
│   ├── stats/      # Per-platform stats sections (GitHub, LeetCode, Codeforces)
│   ├── layout/     # Root layout, nav bar, theme provider/toggle, profile tabs
│   ├── common/     # Shared UI (reveal-on-scroll, chips, carousels, error states)
│   └── ui/         # shadcn-style primitives (button, dialog, sheet, tabs, ...)
├── pages/          # Route-level pages: Landing (chat), About, Projects, Skills, Stats, Contact
├── hooks/          # TanStack Query hooks (chats, details) + navigation helpers
├── store/          # Zustand stores (auth token, chat UI state)
├── lib/            # Env config, utils, syntax highlighter setup, touchpoint classifier
└── routes.tsx      # Router definition with lazy-loaded routes
```

## Backend API contract

The frontend talks to a Spring Boot backend with no versioned path prefix
(e.g. `GET /details/leetcode`, not `/api/v1/details/leetcode`):

- `GET /details/{professional,leetcode,codeforces,github,personality,profile}` —
  public, unauthenticated portfolio content.
- `POST /signup`, `POST /login` — returns an auth token in the
  **`X-Auth-Token` response header** (never in the JSON body). The token is
  sent back as `X-Auth-Token` on authenticated requests.
- `POST /chats`, `GET /chats`, `GET /chats/:id`, `PATCH /chats/:id`,
  `POST /chats/:id/messages`, `POST /chats/search` — chat CRUD and
  messaging, all require auth.
- Errors follow a consistent envelope: `{ showMessageAsIs: boolean, errorMessage: string }`.
- Optional/absent fields are omitted from responses entirely (never sent as
  `null`).

## Deployment

This is a static Vite build (`npm run build` → `dist/`), deployable to any
static host (Vercel, Render Static Site, Netlify, etc.). Set
`VITE_API_BASE_URL` as a build-time environment variable on the host, and
configure CORS on the backend to allow the deployed origin.
