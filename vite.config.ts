import { defineConfig } from 'vite';

// Vite config for the Gatebreaker prototype.
// Phaser is bundled; Supabase is loaded only when env vars are present (see services/).
// On `build` we serve from the GitHub Pages project subpath (/gatebreaker/); dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/gatebreaker/' : '/',
  server: { port: 5173, open: true },
  build: { target: 'es2020', outDir: 'dist' },
}));
