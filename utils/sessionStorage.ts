export const SESSION_TOKEN_STORAGE_KEY = "session";
export function getToken(): string | null {
  return window.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY) ?? null;
}
export function setToken(token: string): void {
  window.localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
}
export function clearToken() {
  window.localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
}