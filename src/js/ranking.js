const rankingBlocos = [
  document.getElementById('ranking-jogador-1'),
  document.getElementById('ranking-jogador-2'),
  document.getElementById('ranking-jogador-3')
];

const atualizarRanking = (Jogadores) => {
  const jogadoresLS = JSON.parse(localStorage.getItem("jogadores")) || [];

  // Atualiza localStorage com pontuações atuais
  Jogadores.forEach(j => {
    const idx = jogadoresLS.findIndex(js => js.nome === j.nome);
    if (idx >= 0) jogadoresLS[idx].score = j.pontuacao;
    else jogadoresLS.push({ nome: j.nome, score: j.pontuacao, nivel: j.nivel || 1 });
  });

  localStorage.setItem("jogadores", JSON.stringify(jogadoresLS));

  // Ordena pelo score
  jogadoresLS.sort((a, b) => b.score - a.score);

  // Preenche os blocos do ranking
  rankingBlocos.forEach((bloco, i) => {
    if (bloco) {
      const j = jogadoresLS[i];
      if (j) {
        let medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
        bloco.innerText = `${medalha} ${j.nome} - ${j.score} pts`;
      } else {
        bloco.innerText = "";
      }
    }
  });
};
