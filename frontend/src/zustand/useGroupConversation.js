import { create } from 'zustand';

const useGroupConversation = create((set) => ({
  selectedGroup: null,
  messages: [],

  setSelectedGroup: (selectedGroup) =>
    set({ selectedGroup, messages: [] }), // reset messages on group change

  setMessages: (msgs) =>
    set({
      // only set if array, otherwise fallback to empty array
      messages: Array.isArray(msgs) ? msgs : [],
    }),

  addMessage: (msg) =>
    set((state) => ({
      messages: Array.isArray(state.messages) ? [...state.messages, msg] : [msg],
    })),
}));

export default useGroupConversation;