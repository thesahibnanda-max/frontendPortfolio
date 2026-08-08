import { api } from './client'
import type {
  ChatObject,
  ChatResponse,
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
