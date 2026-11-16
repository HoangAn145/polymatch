import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import handler from './api/platform';

export default defineConfig(({ mode }) => {
  const values = loadEnv(mode, process.cwd(), '');
  for (const name of [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'GEMINI_API_KEY',
    'GEMINI_MODEL',
  ])
    if (!process.env[name] && values[name]) process.env[name] = values[name];
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'polymatch-api',
        configureServer(server) {
          server.middlewares.use('/api/platform', (req, res) => {
            void handler(req, res);
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
