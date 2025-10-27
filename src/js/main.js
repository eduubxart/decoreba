// Seleciona os botões coloridos
const botoes = document.querySelectorAll('.clicavel-canto-esquerdo, .clicavel-canto-direito');

// Seleciona o botão central e elementos de texto
const controleFundo = document.querySelector('.botao-central .fundo');
const controleTexto = document.querySelector('.botao-central p');

// Seleciona os painéis de pontuação e nível
const nivelElement = document.getElementById('nivel');
const inputNome1 = document.getElementById('nome-jogador-1');
const inputNome2 = document.getElementById('nome-jogador-2');
// Variáveis de controle do jogo
const mensagemJogador = document.getElementById('mensagem-jogador');
const totalJogadores = 2; 
const Jogadores = Array.from({ length: totalJogadores }, () => ({
  nome: '',
  sequencia: [],
  respostaJogador: [],
  pontuacao: 0,
}));

let jogadorAtual = 0;
let nivel = 1;
let esperandoResposta = false;
let podeComecar = true;

// ======================
// FUNÇÕES DO JOGO
// ======================

// Pega item aleatório
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
        controleTexto.innerText = 'jogue!';
      }
    }, 600);
  }, 600);
};
// ======================
// FUNÇÃO: MOSTRAR MENSAGEM DE VEZ
// ======================
const coresJogadores = ['#FF5C00', '#fe019a'];

const mostrarMensagemJogador = (jogadorIndex, duracao = 1200) => {
  const jogador = Jogadores[jogadorIndex];

  mensagemJogador.innerHTML = `<span style="color:${coresJogadores[jogadorIndex]}">${jogador.nome}</span>, é sua vez!`;

  // marca o bloco ativo
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
  controleTexto.innerText = 'aguarde';


  const novoBotao = aleatorio(Array.from(botoes));
  jogador.sequencia.push(novoBotao);


  nivelElement.innerText = nivel;


  setTimeout(() => {
  mostrarMensagemJogador(jogadorAtual, 1200);
    const novoBotao = aleatorio(Array.from(botoes));
    jogador.sequencia.push(novoBotao);
    mostrarSequencia();
  }, 1300);
}

// Atualiza pontuação
const atualizarPontuacao = () => {
  Jogadores.forEach((jogador, index) => {
    const elPontuacao = document.getElementById(`pontuacao-atual-jogador-${index + 1}`);   
    if (elPontuacao) elPontuacao.innerText = jogador.pontuacao;
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
  const jogador = Jogadores[jogadorAtual];
  if (!esperandoResposta) return;

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
  controleTexto.innerText = 'game over';
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
// ======================
// EVENTO NOVO: INICIAR JOGO COM INPUTS
// ======================
const iniciarJogo = () => {
  const nome1 = inputNome1.value.trim();
  const nome2 = inputNome2.value.trim();

  if(!nome1 || !nome2) {
    alert("Você precisa colocar o nome dos dois jogadores!");
    return; // bloqueia o início
  }


  // Salva os nomes nos objetos dos jogadores
  Jogadores[0].nome = nome1;
  Jogadores[1].nome = nome2;

  // Atualiza o ranking lateral
  document.querySelector('#jogador-1 p:first-child').innerText = nome1;
  document.querySelector('#jogador-2 p:first-child').innerText = nome2;

  // Fecha overlay de nomes
  document.getElementById('nomesjogadores').style.display = 'none';
  podeComecar = false;
  const iniciarJogo = () => {
    const nome1 = inputNome1.value.trim();
    const nome2 = inputNome2.value.trim();
  
    if(!nome1 || !nome2) {
      alert("Você precisa colocar o nome dos dois jogadores!");
      return; // bloqueia o início
    }
    document.getElementById('nomesjogadores').style.display = 'none';
  
    // Salva os nomes nos objetos dos jogadores
    Jogadores[0].nome = nome1;
    Jogadores[1].nome = nome2;
  
    // Atualiza o ranking lateral
    document.querySelector('#jogador-1 p:first-child').innerText = nome1;
    document.querySelector('#jogador-2 p:first-child').innerText = nome2;
  
    // Fecha overlay de nomes
    document.getElementById('nomesjogadores').style.display = 'none';
  
  // Mostra mensagem e só depois começa a rodada
  mostrarMensagemJogador(jogadorAtual, 1200);
  setTimeout(() => {
    novaRodada();
  }, 1300); // espera a mensagem sumir antes de começar
  };

// Listener do Enter nos inputs (fora da função)
[inputNome1, inputNome2].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && podeComecar) {
      iniciarJogo();
    }
  });
});
}
