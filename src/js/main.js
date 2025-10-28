// Seleciona elementos
const botoes = document.querySelectorAll('.clicavel-canto-esquerdo, .clicavel-canto-direito');
const controleFundo = document.querySelector('.botao-central .fundo');
const controleTexto = document.querySelector('.botao-central p');
const nivelElement = document.getElementById('nivel');
const inputNome1 = document.getElementById('nome-jogador-1');
const inputNome2 = document.getElementById('nome-jogador-2');
const jogador1Bloco = document.getElementById('jogador-1');
const jogador2Bloco = document.getElementById('jogador-2');
const mensagemJogador = document.getElementById('mensagem-jogador');

const totalJogadores = 2; 
const Jogadores = Array.from({ length: totalJogadores }, () => ({
  nome: '',
  sequencia: [],
  respostaJogador: [],
  pontuacao: 0,
}));

// Agora é seguro usar Jogadores
const nome1Salvo = localStorage.getItem('nomeJogador1');
if (nome1Salvo) Jogadores[0].nome = nome1Salvo;

const nome2Salvo = localStorage.getItem('nomeJogador2');
if (nome2Salvo) Jogadores[1].nome = nome2Salvo;

let jogadorAtual = 0;
let nivel = 1;
let esperandoResposta = false;
let podeComecar = true;

// ======================
// FUNÇÕES DO JOGO
// ======================

// Aleatório
const aleatorio = (array) => array[Math.floor(Math.random() * array.length)];

// Mostra sequência
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
        controleFundo.style.backgroundColor = 'purple';
        controleTexto.innerText = 'Jogue!';
      }
    }, 600);
  }, 600);
};

// Mostrar mensagem de vez
const coresJogadores = ['#FF5C00', '#fe019a'];
const mostrarMensagemJogador = (jogadorIndex, duracao = 1200) => {
  const jogador = Jogadores[jogadorIndex];
  mensagemJogador.innerHTML = `<span style="color:${coresJogadores[jogadorIndex]}">${jogador.nome}</span>, é sua vez!`;

  document.querySelectorAll('.bloco-jogador').forEach((el, idx) => {
    el.classList.toggle('ativo', idx === jogadorIndex);
  });

  setTimeout(() => {
    mensagemJogador.innerHTML = '';
  }, duracao);
};

// Nova rodada
const novaRodada = () => {
  const jogador = Jogadores[jogadorAtual];
  jogador.respostaJogador = [];
  controleFundo.style.backgroundColor = 'purple';
  controleTexto.innerText = 'Aguarde';

  const novoBotao = aleatorio(Array.from(botoes));
  jogador.sequencia.push(novoBotao);

  nivelElement.innerText = nivel;

  setTimeout(() => {
    mostrarMensagemJogador(jogadorAtual, 1200);
    mostrarSequencia();
  }, 1300);
};

// Atualiza pontuação
const atualizarPontuacao = () => {
  Jogadores.forEach((jogador, index) => {
    document.getElementById(`pontuacao-atual-jogador-${index + 1}`).innerText = jogador.pontuacao;
  });
};

// Verifica respostas
const verificarRespostas = () => {
  const jogador = Jogadores[jogadorAtual];
  esperandoResposta = false;

  const acertouTudo = jogador.respostaJogador.every(
    (res, idx) => res.id === jogador.sequencia[idx].id
  );

  if (acertouTudo) {
    jogador.pontuacao++;
    nivel++;
    controleFundo.style.backgroundColor = 'green';
    controleTexto.innerText = 'Acertou!';
    jogadorAtual = (jogadorAtual + 1) % totalJogadores;
    setTimeout(() => novaRodada(), 1200);
  } else {
    controleFundo.style.backgroundColor = 'red';
    controleTexto.innerText = 'Errou!';
    setTimeout(() => reiniciarJogo(), 1500);
  }
  atualizarPontuacao();
};

// Clique nos botões coloridos
const clicarBotao = (botao) => {
  if (!esperandoResposta) return;
  const jogador = Jogadores[jogadorAtual];
  jogador.respostaJogador.push(botao);
  botao.classList.add('ativo');
  setTimeout(() => botao.classList.remove('ativo'), 400);

  const idx = jogador.respostaJogador.length - 1;
  if (
    jogador.respostaJogador[idx].id !== jogador.sequencia[idx].id ||
    jogador.respostaJogador.length === jogador.sequencia.length
  ) {
    verificarRespostas();
  }
};

// Reinicia jogo
const reiniciarJogo = () => {
  Jogadores.forEach(j => {
    j.sequencia = [];
    j.respostaJogador = [];
    j.pontuacao = 0;
  });
  nivel = 1;
  jogadorAtual = 0;
  podeComecar = true;
  controleFundo.style.backgroundColor = 'gray';
  controleTexto.innerText = 'Game Over';
  atualizarPontuacao();
};

// ======================
// EVENTOS
// ======================

// Start
controleFundo.onclick = () => {
  if (podeComecar) novaRodada();
};

// Botões coloridos
botoes.forEach(botao => {
  botao.onclick = () => clicarBotao(botao);
  botao.onmouseenter = () => botao.classList.add('hover');
  botao.onmouseleave = () => botao.classList.remove('hover');
});

// ======================
// INICIAR JOGO COM INPUTS
// ======================
const iniciarJogo = () => {
  const nome1 = inputNome1.value.trim();
  const nome2 = inputNome2.value.trim();

  if (!nome1 || !nome2) {
    alert("Você precisa colocar os nomes dos dois jogadores!");
    return;
  }

  // Salva no LocalStorage
  localStorage.setItem('nomeJogador1', nome1);
  localStorage.setItem('nomeJogador2', nome2);

  // Salva no objeto do jogo
  Jogadores[0].nome = nome1;
  Jogadores[1].nome = nome2;

  [ 
    { input: inputNome1, bloco: jogador1Bloco, nome: nome1 }, 
    { input: inputNome2, bloco: jogador2Bloco, nome: nome2 } 
  ].forEach(({ input, bloco, nome }) => {
    input.style.display = 'none';
    const pNome = document.createElement('p');
    pNome.classList.add('nome-fixo');
    pNome.innerText = nome;
    bloco.parentNode.insertBefore(pNome, bloco);
    bloco.style.display = 'block';
  });
  
  const overlay = document.getElementById('nomesjogadores');
  if (overlay) overlay.style.display = 'none';
  podeComecar = true;

  mostrarMensagemJogador(jogadorAtual, 1200);
  setTimeout(() => {
    novaRodada();
  }, 1300);
};


// Listener do Enter
[inputNome1, inputNome2].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') iniciarJogo();
  });
});
const inputs = [
  { input: inputNome1, bloco: jogador1Bloco, index: 0 },
  { input: inputNome2, bloco: jogador2Bloco, index: 1 }
];

inputs.forEach(({ input, bloco, index }) => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const nome = input.value.trim();
      if (!nome) return;

      // Salva no objeto do jogador
      Jogadores[index].nome = nome;

      // Substitui o input pelo nome dentro da mesma div
      input.style.display = 'none';
      const pNome = document.createElement('p');
      pNome.classList.add('nome-fixo'); // opcional pra estilizar
      pNome.innerText = nome;

      // Insere o nome acima da pontuação
      bloco.parentNode.insertBefore(pNome, bloco);

      // Mostra o bloco da pontuação (caso estivesse escondido)
      bloco.style.display = 'block';
    }
  });
});