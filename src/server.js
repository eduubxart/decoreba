import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Exemplo de rota backend (testa se o server tá respondendo)
app.get("/api", (req, res) => {
  res.json({ message: "Backend do Decoreba tá online 🚀" });
});

// Serve arquivos estáticos do build do Vite
app.use(express.static(path.join(__dirname, "dist")));

// Qualquer rota que não seja API manda pro index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Decoreba rodando na porta ${PORT} 😎`);
});
