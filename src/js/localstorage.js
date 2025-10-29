// salvar o nome do jogador
export const salvarNome = (index, nome) => {
  localStorage.setItem(`nomeJogador${index + 1}`, nome);
};

// recuperar nome do jogador
export const recuperarNome = (index) => {
  return localStorage.getItem(`nomeJogador${index + 1}`) || '';
};

// salvar pontuação do jogador
export const salvarPontuacao = (index, pontuacao) => {
  localStorage.setItem(`pontuacaoJogador${index + 1}`, pontuacao);
};

// recuperar pontuação
export const recuperarPontuacao = (index) => {
  return Number(localStorage.getItem(`pontuacaoJogador${index + 1}`)) || 0;
};
