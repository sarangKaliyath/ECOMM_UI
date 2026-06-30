import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  setAuth: (token: string, expiresIn: number) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  expiresAt: null,
  isAuthenticated: false,

  setAuth: (token, expiresIn) =>
    set({
      accessToken: token,
      expiresAt: Date.now() + expiresIn * 1000,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      expiresAt: null,
      isAuthenticated: false,
    }),
}));
