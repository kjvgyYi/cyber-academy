import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath, URL } from 'node:url';

/*
 * Produces a single self-contained index.html (all JS, CSS and fonts inlined).
 * Used to publish the app as a hosted page that runs on any device with no
 * local server. Build with: npm run build:single  →  output in dist-single/.
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
  plugins: [rawContent(), react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@content': fileURLToPath(new URL('./content', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-single',
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 100_000,
  },
});
