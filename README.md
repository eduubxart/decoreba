# Decoreba

Aplicação web inspirada no clássico jogo de memória **Simon**, desenvolvida com [Vite](https://vite.dev/) e JavaScript para desafiar seus reflexos e memorização.

## Pré-requisitos

- [Node.js >= 18](https://nodejs.org/)
- [npm](https://www.npmjs.com/) 10+

## Instalação e execução local

```bash
npm install
npm run dev
```

A aplicação ficará acessível em `http://localhost:5173` por padrão.

## Scripts disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento do Vite.
- `npm run build`: gera os arquivos otimizados em `dist/`.
- `npm run preview`: executa um servidor local para inspecionar o build.

## Estrutura do projeto

```text
├── index.html        # Entrada principal da aplicação
├── public/           # Arquivos estáticos servidos como estão (áudios, imagens)
├── src/
│   ├── js/           # Código JavaScript (jogo, ranking, localStorage)
│   ├── styles/       # Folhas de estilo importadas no bundle
│   ├── main.js       # Entrada do Vite que carrega estilos e scripts
│   └── server.js     # Servidor Express opcional para testes locais
├── vite.config.js    # Configuração básica do Vite
└── vercel.json       # Configuração de implantação na Vercel
```

## Deploy na Vercel

O arquivo `vercel.json` já está preparado com:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- `framework`: `vite`
- `rewrites`: redirecionamento para `index.html`, garantindo SPA funcional.

### Passo a passo

1. Instale a CLI da Vercel (opcional, mas recomendado):  
   ```bash
   npm i -g vercel
   ```
2. Faça login:  
   ```bash
   vercel login
   ```
3. Na raiz do projeto, execute o deploy:  
   ```bash
   vercel
   ```
   - Durante a primeira execução, selecione **Create a new project** e confirme os valores detectados automaticamente.
4. Para atualizar o ambiente de produção após alterações:  
   ```bash
   vercel --prod
   ```

## Variáveis de ambiente

Coloque eventuais segredos em arquivos `.env`, que já estão ignorados pelo Git. Na Vercel, configure as mesmas variáveis no painel do projeto (`Settings > Environment Variables`).

## Licença

Este projeto segue a licença ISC definida no `package.json`.

