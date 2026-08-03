import { AxiosError } from "axios";

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) return data;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function getErrorStatus(error: unknown): number | undefined {
  return error instanceof AxiosError ? error.response?.status : undefined;
}
