const { gerarCodigoDeBarras } = require("../utils");
const senhaManager = require("../seguranca/senhaManager");
const { enviarEmail } = require("../controllers/enviarEmail");

function pixQRCode(cliente, rl, menu) {
  let codigoQR = gerarCodigoDeBarras();
  console.log("Código QR gerado: " + codigoQR);
  rl.question("Digite o valor a ser transferido: ", (valor) => {
    let valorTransferido = parseFloat(valor);
    if (isNaN(valorTransferido) || valorTransferido <= 0) {
      console.log("Valor inválido. Tente novamente.");
      pixQRCode(cliente, rl, menu);
      return;
    }
    pedirSenha(cliente, rl, () => {
      cliente.saldo = (parseFloat(cliente.saldo) - valorTransferido).toFixed(2);
      console.log("Transferência via QR code realizada com sucesso!");
      enviarEmail(
        "seu_email@gmail.com",
        "Transferência via QR code",
        `Você recebeu uma transferência via QR code no valor de R$ ${valorTransferido.toFixed(
          2
        )}.`
      );
      menu(cliente);
    });
  });
}

module.exports = pixQRCode;
