// pega os inputs
const addjogador1 = document.getElementById("addjogador1");
const addjogador2 = document.getElementById("addjogador2");

// pega o container do ranking lateral
const ranking1 = document.getElementById("ranking-jogador-1");
const ranking2 = document.getElementById("ranking-jogador-2");

// pega container lateral (onde tem input)
const lateralJogador1 = document.getElementById("pontuacao-atual-jogador-1");
const lateralJogador2 = document.getElementById("pontuacao-atual-jogador-2");

// variáveis de pontuação
let pontosJogador1 = 0;
let pontosJogador2 = 0;

// salvar jogadores (zera pontuação)
function salvarJogadores() {
  const nome1 = addjogador1.value.trim();
  const nome2 = addjogador2.value.trim();

  const jogadores = [
    { nome: nome1, pontuacao: 0 },
    { nome: nome2, pontuacao: 0 },
  ];

  localStorage.setItem("ranking", JSON.stringify(jogadores));

  // zera variáveis de pontuação
  pontosJogador1 = 0;
  pontosJogador2 = 0;

  // atualiza container lateral
  lateralJogador1.textContent = pontosJogador1;
  lateralJogador2.textContent = pontosJogador2;

  atualizarRanking();
}

// atualizar ranking lateral
function atualizarRanking() {
  const dados = JSON.parse(localStorage.getItem("ranking")) || [];

  if (!ranking1 || !ranking2) return;

  // jogador 1
  ranking1.innerHTML = `<p class="nome">${dados[0]?.nome || '-'}</p>
                        <p class="pontuacao">Pontuação: ${dados[0]?.pontuacao || 0}</p>`;
  lateralJogador1.textContent = dados[0]?.pontuacao || 0;

  // jogador 2
  ranking2.innerHTML = `<p class="nome">${dados[1]?.nome || '-'}</p>
                        <p class="pontuacao">Pontuação: ${dados[1]?.pontuacao || 0}</p>`;
  lateralJogador2.textContent = dados[1]?.pontuacao || 0;
}

// atualizar pontuação do jogador
function atualizarPontuacao(jogadorIndex) {
  const dados = localStorage.getItem("ranking");
  if (!dados) return;

  const jogadores = JSON.parse(dados);
  if (!jogadores[jogadorIndex]) return;

  // incrementa a pontuação da variável
  if (jogadorIndex === 0) {
    pontosJogador1++;
    jogadores[0].pontuacao = pontosJogador1;
    lateralJogador1.textContent = pontosJogador1;
  } else {
    pontosJogador2++;
    jogadores[1].pontuacao = pontosJogador2;
    lateralJogador2.textContent = pontosJogador2;
  }

  localStorage.setItem("ranking", JSON.stringify(jogadores));
  atualizarRanking();
}

// eventos
addjogador1.addEventListener("change", salvarJogadores);
addjogador2.addEventListener("change", salvarJogadores);
window.addEventListener("load", atualizarRanking);
