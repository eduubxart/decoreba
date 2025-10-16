import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Configura __dirname com ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicia o Express
const app = express();

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Decoreba rodando na porta ${PORT}`);
});
