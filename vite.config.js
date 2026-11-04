import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative paths let the built site run from any host or folder.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { assetsInlineLimit: 0 }
});
