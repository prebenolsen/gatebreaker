import { defineConfig } from 'vite';

// Vite config for the Gatebreaker prototype.
// Phaser is bundled; Supabase is loaded only when env vars are present (see services/).
export default defineConfig({
  server: { port: 5173, open: true },
  build: { target: 'es2020', outDir: 'dist' },
});
