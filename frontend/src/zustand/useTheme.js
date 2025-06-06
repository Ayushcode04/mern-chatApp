import { create } from 'zustand';

const useTheme = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));

export default useTheme;
