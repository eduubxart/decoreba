import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src/public'), // aponta pro index.html
  build: {
    outDir: path.resolve(__dirname, 'dist'),   // pasta final do build na raiz
    emptyOutDir: true
  }
});
