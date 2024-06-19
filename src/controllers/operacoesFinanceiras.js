const { verificarPrimeirosDigitos } = require("./senhaManager");
const { obterPIN } = require("./pinManager");

function realizarOperacaoFinanceira(tipoOperacao, inputSenha, destinatario) {
  let validacaoSenha = false;

  // Verifica os primeiros 4 dígitos da senha
  validacaoSenha = verificarPrimeirosDigitos(inputSenha);

  if (validacaoSenha) {
    // Se a senha for válida, executa a operação
    switch (tipoOperacao) {
      case "pix":
        const pin = obterPIN();
        console.log(`Realizando PIX para ${destinatario} com PIN: ${pin}`);
        // Lógica para realizar PIX
        break;
      case "transferencia":
        console.log(`Realizando transferência para ${destinatario}`);
        // Lógica para realizar transferência
        break;
      case "compra":
        console.log(`Realizando compra com cartão para ${destinatario}`);
        // Lógica para realizar compra com cartão
        break;
      default:
        console.log("Operação não reconhecida");
    }
    return true; // Operação realizada com sucesso
  } else {
    console.log("Senha inválida para realizar a operação");
    return false; // Senha inválida
  }
}

module.exports = realizarOperacaoFinanceira;
