import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'frontend',
  envDir: path.resolve(__dirname, 'backend'),
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
});
