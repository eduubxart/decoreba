// Seleciona os botões coloridos
const botoes = document.querySelectorAll('.clicavel-canto-esquerdo, .clicavel-canto-direito');

// Seleciona o botão central e elementos de texto
const controleFundo = document.querySelector('.controle-centro-perfeito .fundo');
const controleTexto = document.querySelector('.controle-centro-perfeito p');



// Seleciona os painéis de pontuação e nível
const pontuacaoElement = document.getElementById('pontuacao');
const melhorPontuacaoElement = document.getElementById('melhor-pontuacao');
const nivelElement = document.getElementById('nivel');

// Variáveis de controle do jogo
const totalJogadores = 2; // Pode mudar para 3 ou 4
const Jogadores = Array.from({ length: totalJogadores }, () => ({
  sequencia: [],
  respostaJogador: [],
  pontuacao: 0,
 melhorPontuacao: 0
}));

// Variáveis de controle do jogo
let jogadorAtual = 0;
let nivel = 1;
let esperandoResposta = false;
let podeComecar = true;

// ======================
// FUNÇÕES DO JOGO
// ======================

// Função pra pegar item aleatório
const aleatorio = (array) => array[Math.floor(Math.random() * array.length)];

// Mostra sequência da rodada
const mostrarSequencia = (i = 0) => {
  const jogador = Jogadores[jogadorAtual];
  const botao = jogador.sequencia[i];

  setTimeout(() => {
    botao.classList.add('ativo');
    setTimeout(() => {
      botao.classList.remove('ativo');
      if (i + 1 < jogador.sequencia.length) {
        mostrarSequencia(i + 1);
      } else {
        esperandoResposta = true;
        controleFundo.style.backgroundColor = 'lightblue';
        controleTexto.innerText = `jogador ${jogadorAtual + 1}, é sua vez!`;
      }
    }, 600);
  }, 600);
};

// Começa uma nova rodada
const novaRodada = () => {
  const jogador = Jogadores[jogadorAtual];
  jogador.respostaJogador = [];
  controleFundo.style.backgroundColor = 'yellow';
  controleTexto.innerText = `jogador ${jogadorAtual + 1}, observe `;

  const novoBotao = aleatorio(Array.from(botoes));
  jogador.sequencia.push(novoBotao);

  nivelElement.innerText = nivel;
  mostrarSequencia();
};

// Atualiza pontuação
const atualizarPontuacao = () => {
  Jogadores.forEach((jogador, index) => {
    const el = document.getElementById(`pontuacao-jogador-${index + 1}`);
    if (el) {
      el.innerText = jogador.pontuacao;
    }
  });
};

// Verifica respostas
const verificarRespostas = () => {
  const jogador = Jogadores[jogadorAtual];
  esperandoResposta = false;
  
  const acertouTudo = jogador.respostaJogador.every(
  (res, idx) => res === jogador.sequencia[idx]
);

  if (acertouTudo) {
    jogador.pontuacao++;
    nivel++;
    controleFundo.style.backgroundColor = 'green';
    controleTexto.innerText = `jogador ${jogadorAtual + 1} Acertou!`;

    // Passa para o próximo jogador
    jogadorAtual = (jogadorAtual + 1) % totalJogadores;
    setTimeout(() => novaRodada(), 1200);
  } else {
    controleFundo.style.backgroundColor = 'red';
    controleTexto.innerText = `jogador ${jogadorAtual + 1} Errou! Jogo Reiniciado.`;

    jogador.melhorPontuacao = Math.max(jogador.melhorPontuacao, 
     jogador.pontuacao);
    reiniciarJogo();
  }
  atualizarPontuacao();
};

// Clique nos botões coloridos
const clicarBotao = (botao) => {
  const jogador = Jogadores[jogadorAtual];
  if (!esperandoResposta) return;

  jogador.respostaJogador.push(botao);
  botao.classList.add('ativo');
  setTimeout(() => botao.classList.remove('ativo'), 400);

  const idx = jogador.respostaJogador.length - 1;
  if (
    jogador.respostaJogador[idx] !== jogador.sequencia[idx] || 
    jogador.respostaJogador.length === jogador.sequencia.length
  ) {
    verificarRespostas();
  }
};
// Reinicia o jogo
const reiniciarJogo = () => {
  Jogadores.forEach(j => {
    j.sequencia = [];
    j.respostaJogador = [];
    j.pontuacao = 0; // mantém j.melhorPontuacao
  });
  nivel = 1;
  jogadorAtual = 0;
  podeComecar = true;
  controleFundo.style.backgroundColor = 'lightgray';
  controleTexto.innerText = 'Clique para começar!';
  atualizarPontuacao();
};
// ======================
// EVENTOS
// ======================

// Clique no botão central (start)
controleFundo.onclick = () => {
  if (podeComecar) {
    podeComecar = false;
    novaRodada();
  }
};

// Eventos dos botões coloridos
botoes.forEach((botao) => {
  botao.onclick = () => clicarBotao(botao);

  botao.onmouseenter = () => {
    if (esperandoResposta && !botao.classList.contains('ativo')) {
      botao.classList.add('hover');
    }
  };

  botao.onmouseleave = () => {
    if (esperandoResposta && !botao.classList.contains('ativo')) {
      botao.classList.remove('hover');
    }
  };
});
