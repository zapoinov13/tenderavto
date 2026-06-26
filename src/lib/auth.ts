// Simple client-side demo auth. Stored in localStorage.
const KEY = "tenderavto.session";
const DEMO_EMAIL = "demo@tender.kz";
const DEMO_PASSWORD = "demo1234";

export type Session = { email: string; loggedInAt: number };

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): { ok: true } | { ok: false; error: string } {
  const e = email.trim().toLowerCase();
  if (e !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return { ok: false, error: "Неверный email или пароль. Используйте демо-доступ ниже." };
  }
  const session: Session = { email: e, loggedInAt: Date.now() };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return { ok: true };
}

export function signOut() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
