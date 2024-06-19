let senha;

function definirSenha(novaSenha) {
  senha = novaSenha;
}

function verificarPrimeirosDigitos(inputSenha) {
  const digitosArmazenados = senha.slice(0, 4);
  const digitosInput = inputSenha.slice(0, 4);
  return digitosArmazenados === digitosInput;
}

module.exports = { definirSenha, verificarPrimeirosDigitos };
