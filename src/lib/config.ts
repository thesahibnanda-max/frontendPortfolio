const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error(
    'VITE_API_BASE_URL is not set. Add it to .env (see .env.example).',
  )
}

export const config = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
}
