// pega os inputs
const input1 = document.getElementById("input-jogador-1");
const input2 = document.getElementById("input-jogador-2");

// pega o container do ranking
const ranking1 = document.getElementById("ranking-jogador-1");
const ranking2 = document.getElementById("ranking-jogador-2");

// função pra salvar os nomes
function salvarJogadores() {
  const nome1 = input1.value.trim();
  const nome2 = input2.value.trim();

  const jogadores = [
    { nome: nome1, pontuacao: 0 },
    { nome: nome2, pontuacao: 0 },
  ];

  // salva no localStorage
  localStorage.setItem("ranking", JSON.stringify(jogadores));

  // mostra no ranking lateral
  atualizarRanking();
}

// função pra mostrar o ranking salvo
function atualizarRanking() {
  const dados = localStorage.getItem("ranking");
  if (!dados) return;

  const jogadores = JSON.parse(dados);

  // limpa o conteúdo atual
  ranking1.innerHTML = "";
  ranking2.innerHTML = "";

  // cria os blocos de nome e pontuação
  if (jogadores[0]) {
    ranking1.innerHTML = `
      <p class="nome">${jogadores[0].nome}</p>
      <p class="pontuacao">Pontuação: ${jogadores[0].pontuacao}</p>
    `;
  }
  

  if (jogadores[1]) {
    ranking2.innerHTML = `
      <p class="nome">${jogadores[1].nome}</p>
      <p class="pontuacao">Pontuação: ${jogadores[1].pontuacao}</p>
    `;
  }
}

// escuta quando o jogador sai do input (ou tu pode trocar por botão start)
input1.addEventListener("change", salvarJogadores);
input2.addEventListener("change", salvarJogadores);

// quando a página carregar, já mostra o ranking salvo
window.addEventListener("load", atualizarRanking);
// função pra atualizar a pontuação no ranking
function atualizarPontuacao(jogadorIndex, novaPontuacao) {
  const dados = localStorage.getItem("ranking");
  if (!dados) return;

  const jogadores = JSON.parse(dados);
  if (!jogadores[jogadorIndex]) return;

  // atualiza a pontuação do jogador específico
  jogadores[jogadorIndex].pontuacao = novaPontuacao;

  // salva de novo no localStorage
  localStorage.setItem("ranking", JSON.stringify(jogadores));

  // atualiza o visual do ranking
  atualizarRanking();
}
