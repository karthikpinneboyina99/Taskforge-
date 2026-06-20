'use client';

import { ReactNode, useEffect, useSyncExternalStore } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { TopNav } from './TopNav';
import { AIChatbot } from './AIChatbot';

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && !loading && !user) router.replace('/');
  }, [user, loading, mounted, router]);

  if (!mounted || loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav />
      <main className="flex-1 overflow-auto">{children}</main>
      <AIChatbot />
    </div>
  );
}
