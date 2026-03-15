import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: 'src',
  publicDir: 'public',
  server: {
    host: 'localhost',
    open: true
  },
  preview: {
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    cssMinify: 'esbuild',
    assetsDir: 'assets'
  }
});