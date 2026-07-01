import { useAuthStore } from "./store";

export function waitForAuthReady(): Promise<void> {
  if (useAuthStore.getState().authReady) return Promise.resolve();

  return new Promise((resolve) => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state.authReady) {
        unsubscribe();
        resolve();
      }
    });
  });
}
