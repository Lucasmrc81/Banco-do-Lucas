const { gerarCodigoDeBarras } = require("../utils");
const senhaManager = require("../seguranca/senhaManager");
const { enviarEmail } = require("../controllers/enviarEmail");

function pixChave(cliente, rl, menu) {
  rl.question(
    "Digite a chave Pix (CPF, e-mail ou número de celular): ",
    (chavePix) => {
      if (
        chavePix.match(/\d{11}/) ||
        chavePix.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
      ) {
        rl.question("Digite o valor a ser transferido: ", (valor) => {
          let valorTransferido = parseFloat(valor);
          if (isNaN(valorTransferido) || valorTransferido <= 0) {
            console.log("Valor inválido. Tente novamente.");
            pixChave(cliente, rl, menu);
            return;
          }
          pedirSenha(cliente, rl, () => {
            cliente.saldo = (
              parseFloat(cliente.saldo) - valorTransferido
            ).toFixed(2);
            console.log("Transferência via Chave Pix realizada com sucesso!");
            if (
              chavePix.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
            ) {
              enviarEmail(
                chavePix,
                "Transferência via Pix",
                `Você recebeu uma transferência via Pix no valor de R$ ${valorTransferido.toFixed(
                  2
                )}.`
              );
            }
            menu(cliente);
          });
        });
      } else {
        console.log("Chave Pix inválida.");
        menu(cliente);
      }
    }
  );
}

module.exports = pixChave;
