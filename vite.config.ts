import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Two pages: the app (index.html) and the design system reference (system.html).
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: { app: resolve(__dirname, 'index.html'), system: resolve(__dirname, 'system.html') } } },
});
