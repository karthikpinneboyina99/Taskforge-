'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, ReactNode } from 'react';
import type { UserRole } from '@/lib/auth';

const SESSION_TIMEOUT_MS = 40 * 60 * 1000;
const IDLE_CHECK_INTERVAL = 30_000;

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, endpoint: string) => Promise<string | null>;
  register: (email: string, password: string, name: string, role?: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('taskforge_token');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [user, setUser] = useState<User | null>(null);

  const lastActivityRef = useRef<number>(0);
  const idleCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listenersRef = useRef<(() => void) | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('taskforge_token');
    localStorage.removeItem('taskforge_last_activity');
    setToken(null);
    setUser(null);
  }, []);

  const updateActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    localStorage.setItem('taskforge_last_activity', String(now));
  }, []);

  const startIdleTimer = useCallback(() => {
    const stored = localStorage.getItem('taskforge_last_activity');
    lastActivityRef.current = stored ? Number(stored) : Date.now();
    if (!stored) localStorage.setItem('taskforge_last_activity', String(Date.now()));

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    for (const ev of events) {
      window.addEventListener(ev, updateActivity, { passive: true });
    }

    idleCheckRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current > SESSION_TIMEOUT_MS) {
        logout();
        window.location.href = '/';
      }
    }, IDLE_CHECK_INTERVAL);

    listenersRef.current = () => {
      for (const ev of events) {
        window.removeEventListener(ev, updateActivity);
      }
      if (idleCheckRef.current) clearInterval(idleCheckRef.current);
    };
  }, [updateActivity, logout]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.user) {
          setUser(data.user);
          startIdleTimer();
        } else {
          localStorage.removeItem('taskforge_token');
          setToken(null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem('taskforge_token');
        setToken(null);
      });
    return () => { cancelled = true; };
  }, [token, startIdleTimer]);

  useEffect(() => {
    if (!user) {
      if (listenersRef.current) {
        listenersRef.current();
        listenersRef.current = null;
      }
      if (idleCheckRef.current) {
        clearInterval(idleCheckRef.current);
        idleCheckRef.current = null;
      }
    }
  }, [user]);

  const loading = token !== null && user === null;

  const login = useCallback(async (email: string, password: string, endpoint: string) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Login failed';
    localStorage.setItem('taskforge_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return null;
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role?: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Registration failed';
    return null;
  }, []);

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
