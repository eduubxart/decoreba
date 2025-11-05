import { salvarNome, recuperarNome, salvarPontuacao, recuperarPontuacao } from './localstorage.js';
import { salvarRankingHistorico, atualizarTabelaRanking } from './ranking.js'; 

// ======================
// ELEMENTOS
// ======================
// A lista de botões que precisa ser iterável para a função aleatorio
const botoesArray = Array.from(document.querySelectorAll('.clicavel-canto-esquerdo, .clicavel-canto-direito'));
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

// Cria um objeto de mapeamento para facilitar o acesso aos botões por cor
const botoes = {
    vermelho: document.getElementById('vermelho'),
    azul: document.getElementById('azul'),
    amarelo: document.getElementById('amarelo'),
    verde: document.getElementById('verde'),
};


// ======================
// JOGADORES, ESTADO E VARIÁVEIS DE CONFIGURAÇÃO
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

// Constantes de Tempo
const TEMPO_ATIVO = 400; // Tempo em que o botão fica aceso/ativo
const TEMPO_ENTRE_FLASH = 600; // Tempo de pausa entre os flashes da sequência
const TEMPO_FEEDBACK = 1200; // Tempo que a mensagem 'Acertou/Errou' fica na tela


// ===================================
// 🚨 INTEGRAÇÃO DE ÁUDIO 🚨
// ===================================

// Sons de Feedback (Ajuste os nomes dos arquivos aqui)
const SonsFeedback = {
    acerto: new Audio('/acerto.mp3'), 
    erro: new Audio('/erro.mp3'),     
};

// Sons da Sequência (Ajuste os caminhos para o seu .wav)
const Sons = {
    vermelho: new Audio('/vermelho.mp3'),
    azul: new Audio('/azul.mp3'),
    amarelo: new Audio('/amarelo.mp3'),
    verde: new Audio('/verde.mp3'),
};

// Função auxiliar para tocar o som e reiniciar (Evita que o áudio seja cortado)
const tocarSom = (cor) => {
    const audio = Sons[cor];
    if (audio) {
        audio.currentTime = 0; 
        audio.play().catch(e => console.error("Erro ao tocar áudio:", e)); 
    }
};


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
const mostrarMensagemJogador = (index, duracao = TEMPO_FEEDBACK) => {
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
        
        // 🚨 INTEGRAÇÃO 1: Toca o som quando o CPU acende o botão
        tocarSom(botao.id); 
        
        setTimeout(() => {
            botao.classList.remove('ativo');
            if (i + 1 < jogador.sequencia.length) mostrarSequencia(i + 1);
            else {
                esperandoResposta = true;
                if (controleFundo) controleFundo.style.backgroundColor = 'purple';
                if (controleTexto) controleTexto.innerText = 'Jogue!';
            }
        }, TEMPO_ATIVO);
    }, TEMPO_ENTRE_FLASH); // Usa o tempo entre flashes
};

const novaRodada = () => {
    const jogador = Jogadores[jogadorAtual];
    
    if (jogador.chances <= 0) {
        // Se o jogador atual não tem mais chances, a verificação vai alternar para o próximo.
        verificarRespostas(); 
        return;
    }
    
    jogador.respostaJogador = [];
    if (controleFundo) controleFundo.style.backgroundColor = 'gray';
    if (controleTexto) controleTexto.innerText = 'Aguarde';
    
    jogador.sequencia.push(aleatorio(botoesArray)); // Use botoesArray para o aleatorio
    
    nivel = jogador.sequencia.length; 
    if (nivelElement) nivelElement.innerText = nivel;
    
    mostrarMensagemJogador(jogadorAtual, 1200);
    setTimeout(mostrarSequencia, 1300);
};

const verificarRespostas = () => {
    const jogador = Jogadores[jogadorAtual];
    esperandoResposta = false;
    
    if (jogador.chances > 0) {
        const acertouTudo = jogador.respostaJogador.length === jogador.sequencia.length &&
                           jogador.respostaJogador.every((res, i) => res.id === jogador.sequencia[i].id);

        if (acertouTudo) {
            jogador.pontuacao++;
            
            // 🚨 INTEGRAÇÃO 3A: Som de Acerto!
            SonsFeedback.acerto.currentTime = 0;
            SonsFeedback.acerto.play().catch(e => console.warn("Acerto: Erro ao tocar áudio."));

            if (controleFundo) controleFundo.style.backgroundColor = 'green';
            if (controleTexto) controleTexto.innerText = 'Acertou!';
        } else {
            jogador.chances--;
            
            // 🚨 INTEGRAÇÃO 3B: Som de Erro!
            SonsFeedback.erro.currentTime = 0;
            SonsFeedback.erro.play().catch(e => console.warn("Erro: Erro ao tocar áudio."));

            if (controleFundo) controleFundo.style.backgroundColor = 'red';
            if (controleTexto) controleTexto.innerText = `Errou!`;

            if (jogador.chances <= 0) {
                salvarRankingFinal();
            }
        }
    }

    atualizarPontuacaoNaTela();

    const ambosPerderam = Jogadores.every(j => j.chances <= 0 || (modoDeJogo === 'solo' && j.id === 1));
    if (ambosPerderam) {
        if (controleFundo) controleFundo.style.backgroundColor = 'gray';
        if (controleTexto) controleTexto.innerText = ' GAME OVER ';
        salvarRankingFinal();
        jogoIniciado = false;
        setTimeout(reiniciarJogo, TEMPO_FEEDBACK);
        return;
    }

    // Lógica de alternância (Pula jogadores que perderam)
    let proximoJogador = jogadorAtual;
    let tentativaMaxima = 0;

    do {
        proximoJogador = (proximoJogador + 1) % Jogadores.length;
        tentativaMaxima++;
    } while (Jogadores[proximoJogador].chances <= 0 && tentativaMaxima < Jogadores.length);
    
    jogadorAtual = proximoJogador;

    setTimeout(novaRodada, TEMPO_FEEDBACK);
};

const clicarBotao = botao => {
    if (!esperandoResposta) return;
    const jogador = Jogadores[jogadorAtual];
    
    if (jogador.chances <= 0) return; 
    
    // 🚨 INTEGRAÇÃO 2: Toca o som quando o jogador clica
    tocarSom(botao.id); 

    jogador.respostaJogador.push(botao);
    botao.classList.add('ativo');
    setTimeout(() => botao.classList.remove('ativo'), 150);

    const idx = jogador.respostaJogador.length - 1;
    
    // Verifica se o clique está INCORRETO ou se a sequência inteira foi completada
    if (jogador.respostaJogador[idx].id !== jogador.sequencia[idx].id || 
        jogador.respostaJogador.length === jogador.sequencia.length) {
        verificarRespostas();
    }
};

// ... (Restante das funções: reiniciarJogo, iniciarJogo, etc.) ...
// O restante do seu código (reiniciarJogo, iniciarJogo, eventos) permanece praticamente o mesmo,
// pois a lógica de áudio foi integrada nas funções de estado (mostrarSequencia, verificarRespostas, clicarBotao).

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
        const isDuo = modoDeJogo === 'duo';
        addNome2.style.display = isDuo ? 'block' : 'none';
        addNome2.value = '';
    }

    if (blocoJogador2) {
        const isSolo = modoDeJogo === 'solo';
        blocoJogador2.style.display = isSolo ? 'none' : 'block';
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
    // ... (Lógica de validação de nomes) ...

    const nomes = [addNome1?.value.trim() || '', addNome2?.value.trim() || ''];
    const numJogadoresAtivos = modoDeJogo === 'solo' ? 1 : Jogadores.length;

    // VALIDAÇÃO CRUCIAL
    for (let i = 0; i < numJogadoresAtivos; i++) {
        if (!nomes[i]) return alert(`Preencha o nome do Jogador ${i + 1}!`);
        if (nomes[i].length > 8) return alert("Máx. 8 letras por nome!");
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
// EVENTOS E OPÇÕES (Sem alterações)
// ======================
if (controleFundo) controleFundo.onclick = () => { 
    const textoControle = controleTexto.innerText.trim();
    if (textoControle === 'START' || textoControle === 'Game Over' || textoControle === 'GAME OVER') {
        iniciarJogo(); 
    }
};

botoesArray.forEach(botao => {
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
// INICIALIZAÇÃO DA PÁGINA (Sem alterações)
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
if (blocoJogador2) blocoJogador2.style.display = (modoDeJogo === 'solo') ? 'none' : 'block';

// 3. Nomes laterais e status do jogo são resetados
document.getElementById(`nome-lateral-jogador-1`).textContent = '';
document.getElementById(`nome-lateral-jogador-2`).textContent = '';
jogoIniciado = false;
podeComecar = false;

// 4. Carrega o ranking
atualizarPontuacaoNaTela();
atualizarTabelaRanking(); 

if (controleTexto) controleTexto.innerText = 'START';