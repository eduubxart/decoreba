import { salvarNome, recuperarNome, salvarPontuacao, recuperarPontuacao } from './localstorage.js';
import { salvarRankingHistorico, atualizarTabelaRanking } from './ranking.js'; 

// ======================
// ELEMENTOS
// ======================
const botoes = document.querySelectorAll('.clicavel-canto-esquerdo, .clicavel-canto-direito');
const controleFundo = document.querySelector('.botao-central .fundo');
const controleTexto = document.querySelector('.botao-central p');
const nivelElement = document.getElementById('nivel');
const mensagemJogador = document.getElementById('mensagem-jogador');
const addNome1 = document.getElementById('addjogador1');
const addNome2 = document.getElementById('addjogador2');
const jogador1Bloco = document.getElementById('lateral-jogador-1');
const jogador2Bloco = document.getElementById('lateral-jogador-2');

// Elementos de Opções (para controle de modo)
const btnOpcoes = document.getElementById("btn-opcoes");
const menuOpcoes = document.getElementById("menu-opcoes");
const blocoJogador2 = document.querySelector(".jogador:nth-child(2)");


// ======================
// JOGADORES (Apenas inicializa a estrutura, os nomes serão lidos dos inputs)
// ======================
const Jogadores = [
    { nome: recuperarNome(0) || '', sequencia: [], respostaJogador: [], pontuacao: recuperarPontuacao(0) || 0, chances: 3 },
    { nome: recuperarNome(1) || '', sequencia: [], respostaJogador: [], pontuacao: recuperarPontuacao(1) || 0, chances: 3 }
];

let jogadorAtual = 0;
let nivel = 1;
let esperandoResposta = false;
let podeComecar = false;
let jogoIniciado = false;
let modoDeJogo = "duo"; 

// ======================
// FUNÇÕES AUXILIARES
// ======================
const aleatorio = arr => arr[Math.floor(Math.random() * arr.length)];

const criarOuAtualizarNome = (bloco, nome, index) => {
    const nomeElement = document.getElementById(`nome-lateral-jogador-${index + 1}`);
    if (nomeElement) nomeElement.textContent = nome;
};

const atualizarPontuacaoNaTela = () => {
    Jogadores.forEach((j, i) => {
        const pontuacaoSpan = document.getElementById(`pontuacao-atual-jogador-${i + 1}`);
        if (pontuacaoSpan) pontuacaoSpan.textContent = j.pontuacao;

        const chancesSpan = document.getElementById(`chances-atual-jogador-${i + 1}`);
        if (chancesSpan) {
            const coracoesMapeados = ["💀", "❤️", "❤️❤️", "❤️❤️❤️"];
            const indice = Math.max(0, Math.min(j.chances, coracoesMapeados.length - 1));
            
            chancesSpan.textContent = coracoesMapeados[indice];
        }
        salvarPontuacao(i, j.pontuacao);
    });
};

// ======================
// MENSAGEM DO JOGADOR
// ======================
const mostrarMensagemJogador = (index, duracao = 1200) => {
    const jogador = Jogadores[index];
    if (!mensagemJogador || jogador.chances <= 0) return;
    
    mensagemJogador.innerHTML = `<span style="color:${['#FF5C00', '#fe019a'][index]}">${jogador.nome}</span>, é sua vez!`;
    document.querySelectorAll('.bloco-jogador').forEach((el, i) => el.classList.toggle('ativo', i === index));
    setTimeout(() => { if (mensagemJogador) mensagemJogador.innerHTML = ''; }, duracao);
};

// ======================
// LÓGICA DO JOGO
// ======================
const mostrarSequencia = (i = 0) => {
    const jogador = Jogadores[jogadorAtual];
    const botao = jogador.sequencia[i];
    
    if (jogador.chances <= 0) return; 

    setTimeout(() => {
        botao.classList.add('ativo');
        setTimeout(() => {
            botao.classList.remove('ativo');
            if (i + 1 < jogador.sequencia.length) mostrarSequencia(i + 1);
            else {
                esperandoResposta = true;
                if (controleFundo) controleFundo.style.backgroundColor = 'purple';
                if (controleTexto) controleTexto.innerText = 'Jogue!';
            }
        }, 600);
    }, 600);
};

const novaRodada = () => {
    const jogador = Jogadores[jogadorAtual];
    
    if (jogador.chances <= 0) {
        verificarRespostas(); 
        return;
    }
    
    jogador.respostaJogador = [];
    if (controleFundo) controleFundo.style.backgroundColor = 'gray';
    if (controleTexto) controleTexto.innerText = 'Aguarde';
    
    jogador.sequencia.push(aleatorio(Array.from(botoes)));
    
    nivel = jogador.sequencia.length; 
    if (nivelElement) nivelElement.innerText = nivel;
    
    mostrarMensagemJogador(jogadorAtual, 1200);
    setTimeout(mostrarSequencia, 1300);
};

const verificarRespostas = () => {
    const jogador = Jogadores[jogadorAtual];
    esperandoResposta = false;
    
    if (jogador.chances > 0) {
        const acertouTudo = jogador.respostaJogador.every((res, i) => res.id === jogador.sequencia[i].id);

        if (acertouTudo) {
            jogador.pontuacao++;
            if (controleFundo) controleFundo.style.backgroundColor = 'green';
            if (controleTexto) controleTexto.innerText = 'Acertou!';
        } else {
            jogador.chances--;
            if (controleFundo) controleFundo.style.backgroundColor = 'red';
            if (controleTexto) controleTexto.innerText = `Errou!`;

            if (jogador.chances <= 0) {
                salvarRankingFinal();
            }
        }
    }

    atualizarPontuacaoNaTela();

    const ambosPerderam = Jogadores.every(j => j.chances <= 0);
    if (ambosPerderam) {
        if (controleFundo) controleFundo.style.backgroundColor = 'gray';
        if (controleTexto) controleTexto.innerText = ' GAME OVER ';
        salvarRankingFinal();
        jogoIniciado = false;
        setTimeout(reiniciarJogo, 2000);
        return;
    }

    let tentativaMaxima = 0;

    do {
        jogadorAtual = (jogadorAtual + 1) % Jogadores.length;
        tentativaMaxima++;
    } while (Jogadores[jogadorAtual].chances <= 0 && tentativaMaxima < Jogadores.length);
    
    setTimeout(novaRodada, 1200);
};

const clicarBotao = botao => {
    if (!esperandoResposta) return;
    const jogador = Jogadores[jogadorAtual];
    
    if (jogador.chances <= 0) return; 
    
    jogador.respostaJogador.push(botao);
    botao.classList.add('ativo');
    setTimeout(() => botao.classList.remove('ativo'), 400);

    const idx = jogador.respostaJogador.length - 1;
    
    if (jogador.respostaJogador[idx].id !== jogador.sequencia[idx].id || jogador.respostaJogador.length === jogador.sequencia.length) {
        verificarRespostas();
    }
};

// ======================
// REINICIAR JOGO
// ======================
const reiniciarJogo = () => {
    const numJogadoresReset = modoDeJogo === 'solo' ? 1 : Jogadores.length;
    
    Jogadores.forEach((j, i) => { 
        j.sequencia = []; 
        j.respostaJogador = []; 
        j.pontuacao = 0; 
        
        if (i < numJogadoresReset) {
            j.chances = 3;
        } else {
            j.chances = 0;
            j.nome = '';
            salvarNome(i, ''); 
        }
    });
    
    nivel = 1;
    jogadorAtual = 0;
    podeComecar = false;
    jogoIniciado = false;
    
    if (controleFundo) controleFundo.style.backgroundColor = 'gray';
    if (controleTexto) controleTexto.innerText = 'START';
    
    // CORREÇÃO: Mostrar campos de nome novamente, VAZIOS e limpar exibição lateral
    if (addNome1) { addNome1.style.display = 'block'; addNome1.value = ''; }
    if (addNome2) { 
        addNome2.style.display = (modoDeJogo === 'duo') ? 'block' : 'none';
        addNome2.value = '';
    }

    document.getElementById(`nome-lateral-jogador-1`).textContent = '';
    document.getElementById(`nome-lateral-jogador-2`).textContent = '';
    
    atualizarPontuacaoNaTela();
    salvarRankingHistorico(Jogadores);
};

// ======================
// INICIAR JOGO
// ======================
const iniciarJogo = () => {
    const nomes = [addNome1?.value.trim() || '', addNome2?.value.trim() || ''];
    const numJogadoresAtivos = modoDeJogo === 'solo' ? 1 : Jogadores.length;

    // VALIDAÇÃO CRUCIAL
    for (let i = 0; i < numJogadoresAtivos; i++) {
        if (!nomes[i]) return alert(`Preencha o nome do Jogador ${i + 1}!`);
        if (nomes[i].length > 4) return alert("Máx. 4 letras por nome!");
    }
    
    // Configuração de inputs e jogadores
    for (let i = 0; i < Jogadores.length; i++) {
        if (i < numJogadoresAtivos) {
            // Jogadores ativos: USA o nome digitado no input
            Jogadores[i].nome = nomes[i];
            Jogadores[i].pontuacao = 0;
            Jogadores[i].chances = 3;
            salvarNome(i, nomes[i]);
            criarOuAtualizarNome([jogador1Bloco, jogador2Bloco][i], nomes[i], i);
            if ([addNome1, addNome2][i]) [addNome1, addNome2][i].style.display = 'none'; // ESCONDE INPUTS
        } else {
            // Jogador 2 inativo no modo Solo
            Jogadores[i].chances = 0;
            Jogadores[i].nome = ''; 
            salvarNome(i, '');
        }
    }
    
    // Visibilidade do Jogador 2
    if (blocoJogador2) blocoJogador2.style.display = (modoDeJogo === 'solo') ? 'none' : 'block';
    
    atualizarPontuacaoNaTela();
    podeComecar = true;
    jogoIniciado = true;
    
    jogadorAtual = Jogadores.findIndex(j => j.chances > 0);
    if (jogadorAtual === -1) jogadorAtual = 0; 

    mostrarMensagemJogador(jogadorAtual);
    setTimeout(novaRodada, 1300);
};

// ======================
// RANKING HISTÓRICO
// ======================
const salvarRankingFinal = () => {
    salvarRankingHistorico(Jogadores);
};

// ======================
// EVENTOS E OPÇÕES
// ======================
if (controleFundo) controleFundo.onclick = () => { 
    const textoControle = controleTexto.innerText.trim();
    if (textoControle === 'START' || textoControle === 'Game Over' || textoControle === 'GAME OVER') {
        iniciarJogo(); 
    }
};

botoes.forEach(botao => {
    botao.onclick = () => clicarBotao(botao);
    botao.onmouseenter = () => botao.classList.add('hover');
    botao.onmouseleave = () => botao.classList.remove('hover');
});

[addNome1, addNome2].forEach(input => {
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') iniciarJogo(); });
});

// LÓGICA DO MODO DE JOGO
if (btnOpcoes) {
    btnOpcoes.addEventListener("click", () => {
        menuOpcoes.classList.toggle("ativo");
    });
}

document.getElementById("modo-solo").addEventListener("click", () => {
    if (jogoIniciado) {
        alert("O modo de jogo só pode ser alterado antes de começar a partida.");
        menuOpcoes.classList.remove("ativo");
        return; 
    }
    
    modoDeJogo = "solo";
    menuOpcoes.classList.remove("ativo");
    reiniciarJogo();
});

document.getElementById("modo-duo").addEventListener("click", () => {
    if (jogoIniciado) {
        alert("O modo de jogo só pode ser alterado antes de começar a partida.");
        menuOpcoes.classList.remove("ativo");
        return; 
    }

    modoDeJogo = "duo";
    menuOpcoes.classList.remove("ativo");
    reiniciarJogo();
});


// ======================
// INICIALIZAÇÃO DA PÁGINA
// ======================
// 1. Define o modo de jogo inicial e visibilidade do bloco, baseado no último modo jogado.
if (recuperarNome(1)) {
    modoDeJogo = 'duo';
    if (blocoJogador2) blocoJogador2.style.display = 'block';
} else {
    modoDeJogo = 'solo';
    if (blocoJogador2) blocoJogador2.style.display = 'none';
    Jogadores[1].chances = 0; 
}

// 2. Garante que os inputs do HTML estejam vazios e visíveis na recarga.
if (addNome1) { addNome1.style.display = 'block'; addNome1.value = ''; }
if (addNome2) { 
    addNome2.style.display = (modoDeJogo === 'duo') ? 'block' : 'none';
    addNome2.value = '';
}

// 3. Nomes laterais e status do jogo são resetados
document.getElementById(`nome-lateral-jogador-1`).textContent = '';
document.getElementById(`nome-lateral-jogador-2`).textContent = '';
jogoIniciado = false;
podeComecar = false;

// 4. Carrega o ranking
atualizarPontuacaoNaTela();
atualizarTabelaRanking(); 

if (controleTexto) controleTexto.innerText = 'START';