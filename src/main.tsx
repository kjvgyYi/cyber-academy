import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/index.css';
import { supabase } from '@/lib/supabase';
import { ProgressProvider } from '@/lib/progress';
import { App } from './App';

// HashRouter + Supabase OAuth: Supabase appends ?code=... before the hash.
// Exchange the code for a session, then strip the query string so the router
// renders the correct route instead of falling through to #/404.
const searchParams = new URLSearchParams(window.location.search);
if (searchParams.get('code')) {
  supabase.auth.exchangeCodeForSession(window.location.search).finally(() => {
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>,
);
