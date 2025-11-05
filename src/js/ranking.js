const RANKING_KEY = "ranking-historico";

export function carregarRankingHistorico() {
    return JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
}

export function salvarRankingHistorico(jogadores) {
    let ranking = carregarRankingHistorico();

    jogadores.forEach(jogador => {
        if (!jogador.nome) return;
        const idx = ranking.findIndex(r => r.nome === jogador.nome);

        if (idx >= 0) {
            ranking[idx].pontuacao = Math.max(ranking[idx].pontuacao, jogador.pontuacao);
        } else {
            ranking.push({ nome: jogador.nome, pontuacao: jogador.pontuacao });
        }
    });

    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    ranking = ranking.slice(0, 5); // Mantém os 5 melhores

    localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));

    atualizarTabelaRanking();
}

export function atualizarTabelaRanking() {
    const rankingContainer = document.querySelector(".container-ranking");
    if (!rankingContainer) {
        console.warn("Container de ranking não encontrado no HTML");
        return;
    }

    const ranking = carregarRankingHistorico();
    rankingContainer.innerHTML = `
        <p class="titulo-ranking"> RANKING GERAL</p>
    `;

    ranking.forEach((j, i) => {
        let simbolo;
        if (i === 0) simbolo = "🥇";
        else if (i === 1) simbolo = "🥈";
        else if (i === 2) simbolo = "🥉";
        else simbolo = `${i + 1}º`;

        const div = document.createElement("div");
        div.classList.add("ranking-jogador");

        const estilo =
            i === 0
                ? "style='color:#ffd700; font-weight:bold;'"
                : i === 1
                ? "style='color:#c0c0c0;'"
                : i === 2
                ? "style='color:#cd7f32;'"
                : "";

        div.innerHTML = `
            <p ${estilo}>${simbolo} ${j.nome}</p>
            <p>Pontuação: ${j.pontuacao}</p>
        `;

        rankingContainer.appendChild(div);
    });

    if (ranking.length === 0) {
        const vazio = document.createElement("p");
        vazio.textContent = "Nenhum jogador ainda";
        vazio.style.opacity = "0.6";
        rankingContainer.appendChild(vazio);
    }
}

window.addEventListener("load", atualizarTabelaRanking);