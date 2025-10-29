import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // raiz do projeto
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
