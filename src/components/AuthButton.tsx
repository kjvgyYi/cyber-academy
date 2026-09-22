import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { LogIn, LogOut } from 'lucide-react';
import { supabase, signInWithGoogle, signOut } from '@/lib/supabase';
import { cx } from './ui';

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
          <img src={avatar} className="h-7 w-7 rounded-full" alt={name ?? ''} referrerPolicy="no-referrer" />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-raised text-xs font-semibold text-fg">
            {(name ?? user.email ?? '?')[0].toUpperCase()}
          </span>
        )}
        <button
          type="button"
          onClick={() => void signOut()}
          title="Выйти"
          className={cx(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted',
            'transition-colors hover:bg-raised hover:text-fg',
          )}
        >
          <LogOut size={14} /> Выйти
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void signInWithGoogle()}
      className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      <LogIn size={14} /> Войти через Google
    </button>
  );
}
