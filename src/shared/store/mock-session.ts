"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "muse.mock-session";

/**
 * Demo-only credentials. There is no real backend yet — this simulates
 * login so the "guest can view, must sign in to contact" flow can be
 * demoed end to end. Replace with real auth once the Auth feature ships.
 */
const MOCK_USER = { email: "demo@muse.com", password: "123456" };

export interface MockSession {
  email: string;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

function parseSession(raw: string | null): MockSession | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

/** Same-tab localStorage writes don't fire the `storage` event — dispatch
 * one manually so every `useMockSession()` subscriber re-reads and updates. */
function notify() {
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

export function useMockSession() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const session = parseSession(raw);

  const login = useCallback((email: string, password: string) => {
    const matches =
      email.trim().toLowerCase() === MOCK_USER.email &&
      password === MOCK_USER.password;
    if (!matches) return false;

    const next: MockSession = { email: MOCK_USER.email };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
    return true;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    notify();
  }, []);

  return {
    session: mounted ? session : null,
    hydrated: mounted,
    login,
    logout,
  };
}
