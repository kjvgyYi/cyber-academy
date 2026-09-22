import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import { supabase, signInWithGoogle, signOut } from '@/lib/supabase';
import { cx } from './ui';

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/>
    </svg>
  );
}

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (user) {
    const avatar = user.user_metadata?.avatar_url as string | undefined;
    const name = user.user_metadata?.name as string | undefined;
    return (
      <div className="flex items-center gap-2">
        {avatar ? (
          <img
            src={avatar}
            className="h-7 w-7 rounded-full ring-1 ring-line"
            alt={name ?? ''}
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-amber/20 text-xs font-semibold text-amber">
            {(name ?? user.email ?? '?')[0].toUpperCase()}
          </span>
        )}
        <button
          type="button"
          onClick={() => void signOut()}
          title="Выйти"
          className={cx(
            'flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted',
            'transition-colors hover:bg-raised hover:text-fg',
          )}
        >
          <LogOut size={13} /> Выйти
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void signInWithGoogle()}
      className={cx(
        'flex items-center gap-2 rounded-lg border border-amber/40 bg-amber/10 px-2.5 py-1.5',
        'text-xs font-medium text-amber transition-colors hover:border-amber/70 hover:bg-amber/20',
      )}
    >
      <GoogleIcon /> Войти через Google
    </button>
  );
}
