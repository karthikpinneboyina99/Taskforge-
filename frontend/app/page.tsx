'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, User, ExternalLink, ChevronRight, CheckCircle } from 'lucide-react';

type RoleMode = 'admin' | 'employee' | 'external';

const roleConfig: Record<RoleMode, { label: string; icon: typeof Shield }> = {
  admin: { label: 'Admin', icon: Shield },
  employee: { label: 'Employee', icon: User },
  external: { label: 'External', icon: ExternalLink },
};

export default function Home() {
  const { login, register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<RoleMode>('admin');
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (user && !authLoading) router.replace('/boards');
  }, [user, authLoading, router]);

  const switchMode = (newMode: RoleMode) => {
    setMode(newMode);
    setError('');
    setShowPw(false);
    setRegistered(false);
    setShowSignup(newMode !== 'admin');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let err: string | null = null;
    if (showSignup) {
      const role = mode === 'employee' ? 'employee' : 'external';
      err = await register(email, password, name || 'User', role);
    } else if (mode === 'admin') {
      err = await login(email, password, '/api/auth/admin/login');
    } else {
      err = await login(email, password, '/api/auth/login');
    }

    setLoading(false);
    if (err) { setError(err); return; }

    if (showSignup) {
      setRegistered(true);
      setShowSignup(false);
      setPassword('');
    } else {
      router.push('/boards');
    }
  };

  const isSignup = showSignup;
  const isAdmin = mode === 'admin';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative bg-[#06070a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/3 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(32,157,215,0.03)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20 mb-5">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-white">TaskForge</h1>
          <p className="text-sm text-white/40 mt-1.5 font-[425]">AI-powered project management</p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_-12px_rgba(0,0,0,0.8)]">
          <div className="flex bg-white/[0.04] rounded-xl p-[3px] mb-8">
            {(Object.entries(roleConfig) as [RoleMode, typeof roleConfig[RoleMode]][]).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const active = mode === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchMode(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'bg-white text-[#0d0f16] shadow-sm'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <Icon size={15} className={active ? 'text-[#0d0f16]' : ''} />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>

          {registered ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/20">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Account created</p>
                <p className="text-white/30 text-xs mt-1">Sign in with your credentials to continue</p>
              </div>
              <button
                type="button"
                onClick={() => { setRegistered(false); setError(''); }}
                className="w-full h-11 bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl text-sm font-medium"
              >
                Sign in now
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div className="group relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="peer w-full h-12 bg-transparent border-b border-white/[0.08] text-white text-sm outline-none transition-colors focus:border-primary placeholder-transparent pt-4"
                    placeholder="Full name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 top-3.5 text-xs text-white/30 transition-all duration-200 peer-focus:text-[11px] peer-focus:-translate-y-2.5 peer-focus:text-primary peer-placeholder-shown:text-sm peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/30"
                  >
                    Full name
                  </label>
                </div>
              )}

              <div className="group relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete={isSignup ? 'email' : 'username'}
                  className="peer w-full h-12 bg-transparent border-b border-white/[0.08] text-white text-sm outline-none transition-colors focus:border-primary placeholder-transparent pt-4"
                  placeholder="Email address"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-3.5 text-xs text-white/30 transition-all duration-200 peer-focus:text-[11px] peer-focus:-translate-y-2.5 peer-focus:text-primary peer-placeholder-shown:text-sm peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/30"
                >
                  {isAdmin ? 'Admin email' : isSignup ? 'Email address' : 'Company email'}
                </label>
              </div>

              <div className="group relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isSignup ? 6 : undefined}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  className="peer w-full h-12 bg-transparent border-b border-white/[0.08] text-white text-sm outline-none transition-colors focus:border-primary placeholder-transparent pt-4 pr-8"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 top-3.5 text-xs text-white/30 transition-all duration-200 peer-focus:text-[11px] peer-focus:-translate-y-2.5 peer-focus:text-primary peer-placeholder-shown:text-sm peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/30"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/15 px-3.5 py-2.5 rounded-xl">
                  <div className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-11 bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl text-sm font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignup ? 'Create account' : 'Sign in'}
                    <ChevronRight size={15} className="opacity-60" />
                  </>
                )}
              </button>
            </form>
          )}

          {!isAdmin && !registered && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => { setShowSignup(!showSignup); setError(''); setRegistered(false); }}
                className="text-xs text-white/30 hover:text-white/50 transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/30"
              >
                {showSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-white/[0.04]">
            <p className="text-[11px] text-white/20 text-center font-[425] tracking-wide uppercase">
              {isAdmin ? 'Admin access only' : isSignup ? 'Create your account' : 'Sign in to continue'}
            </p>
            <p className="text-xs text-white/30 text-center mt-1.5 font-mono tracking-tight">
              {isAdmin
                ? 'karthikpinneboyina@gmail.com'
                : isSignup
                  ? 'Fill in your details to get started'
                  : 'Enter your credentials'}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-white/15 text-center mt-8 font-[425]">
          &copy; {new Date().getFullYear()} TaskForge. All rights reserved.
        </p>
      </div>
    </div>
  );
}
