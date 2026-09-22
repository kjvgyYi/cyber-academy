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

// Implicit OAuth flow: tokens arrive in the URL hash (#access_token=...).
// Supabase SDK reads them automatically on init; we just strip the token
// params from the hash so HashRouter renders the correct route.
if (window.location.hash.includes('access_token=')) {
  supabase.auth.getSession().finally(() => {
    window.history.replaceState(null, '', window.location.pathname + '#/');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>,
);
