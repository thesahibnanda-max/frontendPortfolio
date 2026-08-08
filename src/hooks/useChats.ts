import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createChat,
  getChat,
  listChats,
  renameChat,
  sendMessage,
  searchChats,
} from '@/api/chats'
import { useAuthStore } from '@/store/auth'

const isAuthed = () => useAuthStore.getState().token !== null

export const useChats = () =>
  useQuery({
    queryKey: ['chats'],
    queryFn: listChats,
    enabled: isAuthed(),
  })

export const useChat = (chatId: string | null) =>
  useQuery({
    queryKey: ['chats', chatId],
    queryFn: () => getChat(chatId as string),
    enabled: chatId !== null,
  })

export const useCreateChat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createChat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chats'] }),
  })
}

export const useRenameChat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ chatId, chatTitle }: { chatId: string; chatTitle: string }) =>
      renameChat(chatId, chatTitle),
    onSuccess: (chat) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
      queryClient.setQueryData(['chats', chat.chatId], chat)
    },
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ chatId, message }: { chatId: string; message: string }) =>
      sendMessage(chatId, message),
    onSuccess: (chat) => {
      queryClient.setQueryData(['chats', chat.chatId], chat)
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export const useSearchChats = () =>
  useMutation({ mutationFn: searchChats })
