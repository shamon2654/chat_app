import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
  messages: [],
  user: [],
  selectUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUser: async () => {
    set({ isUserLoading: true })
    try {
      const res = await axiosInstance.get("message/user")
      set({ user: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUserLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance.get(`/message/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (messageData) => {
    const { selectUser, messages } = get()
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectUser._id}`,
        messageData
      )
      set({ messages: [...messages, res.data] })
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  },

  subscribeToMessages: () => {
    const { selectUser } = get()
    if (!selectUser) return

    const socket = useAuthStore.getState().socket

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectUser._id) return
      set({
        messages: [...get().messages, newMessage],
      })
    })
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  },

  setSelectedUser: (selectUser) => set({ selectUser }),
}))
