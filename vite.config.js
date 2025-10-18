import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/public',
  build: {
    outDir: '../../dist',
    emptyOutDir: true
  }
});
// Exemplo de chamada no front
fetch("http://localhost:3000/api")
  .then((res) => res.json())
  .then((data) => console.log(data));