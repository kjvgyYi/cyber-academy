import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const googleClientId = import.meta.env.VITE_SUPABASE_GOOGLE_CLIENT_ID as string | undefined;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://kjvgyyi.github.io/cyber-academy/',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
        ...(googleClientId ? { client_id: googleClientId } : {}),
      },
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
  return supabase.auth.onAuthStateChange(callback);
}
