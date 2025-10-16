import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'public'),
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, '/index.html') // entrada principal
      }
    },
    outDir: path.resolve(__dirname, 'dist'), // pasta do build
    emptyOutDir: true
  }
});
