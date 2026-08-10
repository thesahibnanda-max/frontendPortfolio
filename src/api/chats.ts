import { ApiError, api } from './client'
import { parseSseStream } from './sse'
import type {
  ApiErrorPayload,
  ChatObject,
  ChatResponse,
  ChatStreamDoneEvent,
  ChatStreamTokenEvent,
  ListOfChatResponse,
  SearchResponse,
} from './types'

export const createChat = (chatTitle: string) =>
  api
    .post<ListOfChatResponse>('/chats', { chatTitle }, { auth: true })
    .then((r) => r.chats[0] as ChatObject)

export const listChats = () =>
  api.get<ListOfChatResponse>('/chats', { auth: true }).then((r) => r.chats)

export const getChat = (chatId: string) =>
  api.get<ChatResponse>(`/chats/${chatId}`, { auth: true }).then((r) => r.chat)

export const renameChat = (chatId: string, chatTitle: string) =>
  api
    .patch<ChatResponse>(`/chats/${chatId}`, { chatTitle }, { auth: true })
    .then((r) => r.chat)

export const sendMessage = (chatId: string, message: string) =>
  api
    .post<ChatResponse>(`/chats/${chatId}/messages`, { message }, { auth: true })
    .then((r) => r.chat)

export const searchChats = (query: string) =>
  api.post<SearchResponse>('/chats/search', { query }, { auth: true })

export interface StreamMessageHandlers {
  onToken: (content: string) => void
  onDone: (message: string, timestamp: string) => void
}

/**
 * Streams an assistant reply token-by-token over SSE. Resolves once the
 * `done` event lands (having already called `onDone`); throws `ApiError` if
 * the stream emits an `error` event (status 502 — see task-9 brief, the SSE
 * `error` event carries no HTTP status of its own since the response already
 * committed to 200/text/event-stream by the time it can be sent).
 */
export async function streamMessage(
  chatId: string,
  message: string,
  handlers: StreamMessageHandlers,
): Promise<void> {
  const res = await api.stream(`/chats/${chatId}/messages/stream`, { message })
  for await (const frame of parseSseStream(res)) {
    if (frame.event === 'token') {
      handlers.onToken((JSON.parse(frame.data) as ChatStreamTokenEvent).content)
    } else if (frame.event === 'done') {
      const done = JSON.parse(frame.data) as ChatStreamDoneEvent
      handlers.onDone(done.message, done.timestamp)
      return
    } else if (frame.event === 'error') {
      const payload = JSON.parse(frame.data) as ApiErrorPayload
      throw new ApiError(502, payload)
    }
  }
}
