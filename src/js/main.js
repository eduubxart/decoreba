import { salvarNome, recuperarNome, salvarPontuacao, recuperarPontuacao } from './localstorage.js';

// ======================
// ELEMENTOS
// ======================
const botoes = document.querySelectorAll('.clicavel-canto-esquerdo, .clicavel-canto-direito');
const controleFundo = document.querySelector('.botao-central .fundo');
const controleTexto = document.querySelector('.botao-central p');
const nivelElement = document.getElementById('nivel');
const mensagemJogador = document.getElementById('mensagem-jogador');
const rankingDiv = document.getElementById("ranking");
const inputNome1 = document.getElementById('input-jogador-1');
const inputNome2 = document.getElementById('input-jogador-2');
const jogador1Bloco = document.getElementById('lateral-jogador-1');
const jogador2Bloco = document.getElementById('lateral-jogador-2');

// ======================
// JOGADORES
// ======================
const Jogadores = [
  { nome: recuperarNome(0) || '', sequencia: [], respostaJogador: [], pontuacao: recuperarPontuacao(0) || 0 },
  { nome: recuperarNome(1) || '', sequencia: [], respostaJogador: [], pontuacao: recuperarPontuacao(1) || 0 }
];

let jogadorAtual = 0;
let nivel = 1;
let esperandoResposta = false;
let podeComecar = false;

// ======================
// FUNÇÕES AUXILIARES
// ======================
const aleatorio = array => array[Math.floor(Math.random() * array.length)];

const atualizarPontuacaoNaTela = () => {
  Jogadores.forEach((j, i) => {
    const span = document.getElementById(`pontuacao-atual-jogador-${i + 1}`);
    if(span) span.innerText = j.pontuacao;
    salvarPontuacao(i, j.pontuacao);
  });
  atualizarRanking();
};

const criarOuAtualizarNome = (bloco, nome) => {
  if (!bloco) return;
  let p = bloco.parentNode.querySelector('.nome-fixo');
  if (!p) {
    p = document.createElement('p');
    p.classList.add('nome-fixo');
    bloco.parentNode.insertBefore(p, bloco);
  }
  p.innerText = nome;
  bloco.style.display = 'block';
};

const mostrarMensagemJogador = (index, duracao = 1200) => {
  const jogador = Jogadores[index];
  if (!mensagemJogador) return;
  mensagemJogador.innerHTML = `<span style="color:${['#FF5C00', '#fe019a'][index]}">${jogador.nome}</span>, é sua vez!`;
  document.querySelectorAll('.bloco-jogador').forEach((el, i) => el.classList.toggle('ativo', i === index));
  setTimeout(() => { if(mensagemJogador) mensagemJogador.innerHTML = ''; }, duracao);
};

// ======================
// JOGO
// ======================
const mostrarSequencia = (i = 0) => {
  const botao = Jogadores[jogadorAtual].sequencia[i];
  setTimeout(() => {
    botao.classList.add('ativo');
    setTimeout(() => {
      botao.classList.remove('ativo');
      if (i + 1 < Jogadores[jogadorAtual].sequencia.length) mostrarSequencia(i + 1);
      else {
        esperandoResposta = true;
        if(controleFundo) controleFundo.style.backgroundColor = 'purple';
        if(controleTexto) controleTexto.innerText = 'Jogue!';
      }
    }, 600);
  }, 600);
};

const novaRodada = () => {
  const jogador = Jogadores[jogadorAtual];
  jogador.respostaJogador = [];
  if(controleFundo) controleFundo.style.backgroundColor = 'purple';
  if(controleTexto) controleTexto.innerText = 'Aguarde';
  jogador.sequencia.push(aleatorio(Array.from(botoes)));
  if(nivelElement) nivelElement.innerText = nivel;
  mostrarMensagemJogador(jogadorAtual, 1200);
  setTimeout(mostrarSequencia, 1300);
};

const verificarRespostas = () => {
  const jogador = Jogadores[jogadorAtual];
  esperandoResposta = false;
  const acertouTudo = jogador.respostaJogador.every((res, i) => res.id === jogador.sequencia[i].id);

  if (acertouTudo) {
    jogador.pontuacao++;
    nivel++;
    if(controleFundo) controleFundo.style.backgroundColor = 'green';
    if(controleTexto) controleTexto.innerText = 'Acertou!';
    jogadorAtual = (jogadorAtual + 1) % Jogadores.length;
    setTimeout(novaRodada, 1200);
  } else {
    if(controleFundo) controleFundo.style.backgroundColor = 'red';
    if(controleTexto) controleTexto.innerText = 'Errou!';
    salvarRankingFinal();
    setTimeout(reiniciarJogo, 1500);
  }
  atualizarPontuacaoNaTela();
};

const clicarBotao = botao => {
  if (!esperandoResposta) return;
  const jogador = Jogadores[jogadorAtual];
  jogador.respostaJogador.push(botao);
  botao.classList.add('ativo');
  setTimeout(() => botao.classList.remove('ativo'), 400);

  const idx = jogador.respostaJogador.length - 1;
  if (idx >= jogador.sequencia.length - 1 || jogador.respostaJogador[idx].id !== jogador.sequencia[idx].id) {
    verificarRespostas();
  }
};

const reiniciarJogo = () => {
  Jogadores.forEach(j => { j.sequencia = []; j.respostaJogador = []; j.pontuacao = 0; });
  nivel = 1;
  jogadorAtual = 0;
  podeComecar = true;
  if(controleFundo) controleFundo.style.backgroundColor = 'gray';
  if(controleTexto) controleTexto.innerText = 'Game Over';
  atualizarPontuacaoNaTela();
};

// ======================
// INICIAR JOGO COM INPUTS
// ======================
const iniciarJogo = () => {
  const nomes = [inputNome1?.value.trim() || '', inputNome2?.value.trim() || ''];
  if (nomes.some(n => !n)) return alert("Você precisa colocar os nomes dos dois jogadores!");

  nomes.forEach((nome, i) => {
    Jogadores[i].nome = nome;
    salvarNome(i, nome);
    criarOuAtualizarNome([jogador1Bloco, jogador2Bloco][i], nome);
    if([inputNome1, inputNome2][i]) [inputNome1, inputNome2][i].style.display = 'none';
  });

  podeComecar = true;
  mostrarMensagemJogador(jogadorAtual);
  setTimeout(novaRodada, 1300);
};

// ======================
// RANKING
// ======================
const atualizarRanking = () => {
  const jogadoresLS = JSON.parse(localStorage.getItem("jogadores")) || [];
  jogadoresLS.sort((a, b) => b.score - a.score);
  if(rankingDiv) rankingDiv.innerHTML = "";
  jogadoresLS.forEach((jogador, index) => {
    let medalha = "";
    if(index === 0) medalha = "🥇";
    else if(index === 1) medalha = "🥈";
    else if(index === 2) medalha = "🥉";

    if(rankingDiv){
      const jogadorRank = document.createElement("div");
      jogadorRank.innerHTML = `${medalha} ${jogador.nome} - ${jogador.score} pts`;
      rankingDiv.appendChild(jogadorRank);
    }
  });
};

const salvarRankingFinal = () => {
  const jogadoresLS = JSON.parse(localStorage.getItem("jogadores")) || [];
  Jogadores.forEach(j => {
    const idx = jogadoresLS.findIndex(jLS => jLS.nome === j.nome);
    if(idx >= 0) jogadoresLS[idx].score = j.pontuacao;
    else jogadoresLS.push({ nome: j.nome, score: j.pontuacao, nivel });
  });
  localStorage.setItem("jogadores", JSON.stringify(jogadoresLS));
  atualizarRanking();
};

// ======================
// EVENTOS
// ======================
if(controleFundo) controleFundo.onclick = () => { if (podeComecar) novaRodada(); };

botoes.forEach(botao => {
  botao.onclick = () => clicarBotao(botao);
  botao.onmouseenter = () => botao.classList.add('hover');
  botao.onmouseleave = () => botao.classList.remove('hover');
});

[inputNome1, inputNome2].forEach(input => {
  if(input) input.addEventListener('keydown', e => { if(e.key === 'Enter') iniciarJogo(); });
});

// ======================
// INICIALIZAÇÃO
// ======================
Jogadores.forEach((j, i) => { if (j.nome) criarOuAtualizarNome([jogador1Bloco, jogador2Bloco][i], j.nome); });
atualizarPontuacaoNaTela();

