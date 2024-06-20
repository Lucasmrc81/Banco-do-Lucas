const { gerarCodigoDeBarras } = require("../utils");
const senhaManager = require("../seguranca/senhaManager");
const { enviarEmail } = require("../controllers/enviarEmail");
function pixCopiaCola(cliente, rl, menu) {
  rl.question(
    "Digite o código de Copia e Cola para transferência: ",
    (codigoCopiaCola) => {
      let valorTransferido = parseFloat(codigoCopiaCola.slice(-2));
      if (isNaN(valorTransferido) || valorTransferido <= 0) {
        console.log("Valor inválido. Tente novamente.");
        pixCopiaCola(cliente, rl, menu);
        return;
      }
      pedirSenha(cliente, rl, () => {
        cliente.saldo = (parseFloat(cliente.saldo) - valorTransferido).toFixed(
          2
        );
        console.log("Transferência via Copia e Cola realizada com sucesso!");
        menu(cliente);
      });
    }
  );
}

module.exports = pixCopiaCola;
