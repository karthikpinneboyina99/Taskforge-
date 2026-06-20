'use client';

import { Moon, Sun, ChevronDown, LogOut } from 'lucide-react';
import { useUiStore, type Page } from '@/store/uiStore';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems: { label: string; page: Page; href: string }[] = [
  { label: 'Dashboard', page: 'dashboard', href: '/dashboard' },
  { label: 'Boards', page: 'boards', href: '/boards' },
  { label: 'Analytics', page: 'analytics', href: '/analytics' },
  { label: 'AI', page: 'ai', href: '/ai' },
  { label: 'Team', page: 'team', href: '/team' },
  { label: 'Settings', page: 'settings', href: '/settings' },
  { label: 'Pricing', page: 'pricing', href: '/pricing' },
];

function NavLinks() {
  const { activePage, setActivePage } = useUiStore();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.page}
          href={item.href}
          onClick={() => setActivePage(item.page)}
          className={cn(
            'relative px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
            activePage === item.page
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {item.label}
          {activePage === item.page && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
          )}
        </Link>
      ))}
    </nav>
  );
}

export function TopNav() {
  const { darkMode, toggleDarkMode } = useUiStore();
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <header className="h-14 border-b border-border bg-background flex items-center px-4 flex-shrink-0">
      <div className="flex items-center gap-3 w-[200px] flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
          <rect width="32" height="32" rx="8" fill="url(#topnav_logo)" />
          <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="topnav_logo" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#209dd7" />
              <stop offset="1" stopColor="#753991" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-bold text-sm text-foreground tracking-tight hidden sm:inline">TaskForge</span>
      </div>

      <div className="flex-1 flex justify-center">
        <NavLinks />
      </div>

      <div className="flex items-center gap-1 w-[200px] justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          aria-label="Log out"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut size={18} />
        </Button>

        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shadow-sm">
            {initial}
          </div>
          <span className="text-sm text-foreground font-medium hidden sm:inline">{user?.name || 'User'}</span>
          <ChevronDown size={14} className="text-muted-subtle hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
