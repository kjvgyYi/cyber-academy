/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/*
 * Loads Markdown and YAML content files as raw string modules. This keeps the
 * "drop a file into /content and it appears" workflow while staying independent
 * of the bundler's own `?raw` handling (Vite 8 / rolldown mis-parses .yaml there).
 */
function rawContent(): Plugin {
  const exts = ['.md', '.yaml', '.yml'];
  return {
    name: 'cyber-academy:raw-content',
    enforce: 'pre',
    transform(code, id) {
      const clean = id.split('?')[0];
      if (exts.some((e) => clean.endsWith(e))) {
        return { code: `export default ${JSON.stringify(code)};`, map: null };
      }
    },
  };
}

export default defineConfig({
  plugins: [rawContent(), react(), tailwindcss()],
  // Relative base: the production build also works when opened from any folder.
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@content': fileURLToPath(new URL('./content', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
});
