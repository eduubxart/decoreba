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
let sequencia = [];
let respostaJogador = [];
let pontuacao = 0;
let melhorPontuacao = 0;
let nivel = 1;
let esperandoResposta = false;
let podeComecar = true;

// Função pra pegar item aleatório
const aleatorio = (array) => array[Math.floor(Math.random() * array.length)];

// Mostra sequência da rodada
const mostrarSequencia = (i = 0) => {
  const botao = sequencia[i];

  setTimeout(() => {
    botao.classList.add('ativo');
    setTimeout(() => {
      botao.classList.remove('ativo');
      if (i + 1 < sequencia.length) {
        mostrarSequencia(i + 1);
      } else {
        esperandoResposta = true;
        controleFundo.style.backgroundColor = 'lightblue';
        controleTexto.innerText = 'Sua vez!';
      }
    }, 600);
  }, 600);
};

// Começa uma nova rodada
const novaRodada = () => {
  respostaJogador = [];
  controleFundo.style.backgroundColor = 'yellow';
  controleTexto.innerText = 'Observe';

  const novoBotao = aleatorio(Array.from(botoes));
  sequencia.push(novoBotao);

  nivelElement.innerText = nivel;
  mostrarSequencia();
};

// Atualiza pontuação
const atualizarPontuacao = () => {
  pontuacaoElement.innerText = pontuacao;
  melhorPontuacaoElement.innerText = melhorPontuacao;
};

// Verifica respostas
const verificarRespostas = () => {
  esperandoResposta = false;
  let acertouTudo = true;

  for (let i = 0; i < sequencia.length; i++) {
    if (sequencia[i] !== respostaJogador[i]) {
      acertouTudo = false;
      break;
    }
  }

  if (acertouTudo) {
    pontuacao++;
    nivel++;
    controleFundo.style.backgroundColor = 'green';
    controleTexto.innerText = 'Acertou!';
    setTimeout(() => novaRodada(), 1200);
  } else {
    controleFundo.style.backgroundColor = 'red';
    controleTexto.innerText = 'Errou!';
    melhorPontuacao = Math.max(melhorPontuacao, pontuacao);
    pontuacao = 0;
    nivel = 1;
    sequencia = [];
    podeComecar = true;
  }

  atualizarPontuacao();
};

// Clique nos botões coloridos
const clicarBotao = (botao) => {
  if (!esperandoResposta) return;

  respostaJogador.push(botao);
  botao.classList.add('ativo');

  setTimeout(() => botao.classList.remove('ativo'), 400);

  const index = respostaJogador.length - 1;
  if (respostaJogador[index] !== sequencia[index] || respostaJogador.length === sequencia.length) {
    verificarRespostas();
  }
};

// Clique no botão central (start)
controleFundo.onclick = () => {
  if (podeComecar) {
    podeComecar = false;
    controleFundo.style.backgroundColor = 'yellow';
    controleTexto.innerText = 'Observe';
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
