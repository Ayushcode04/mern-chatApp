// frontend/src/zustand/useGroupConversation.js
import { create } from "zustand";

const useGroupConversation = create((set) => ({
  selectedGroup: null,
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useGroupConversation;