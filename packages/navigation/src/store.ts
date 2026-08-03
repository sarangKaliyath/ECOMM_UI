import { create } from "zustand";

interface NavigationState {
  navigate: (path: string) => void;
  setNavigate: (fn: (path: string) => void) => void;
}

// Default navigate falls back to a hard redirect — used when no host router
// has registered a real navigate function yet (e.g. a remote running standalone).
export const useNavigationStore = create<NavigationState>((set) => ({
  navigate: (path) => {
    window.location.href = path;
  },
  setNavigate: (fn) => set({ navigate: fn }),
}));
