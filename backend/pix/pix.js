const pixQRCode = require("./pixQRCode");
const pixChave = require("./pixChave");
const pixCopiaCola = require("./pixCopiaCola");

function realizarPix(cliente, rl, menu) {
  console.log("\nEscolha uma opção de pagamento com Pix:");
  console.log("1: QR code");
  console.log("2: Chave Pix");
  console.log("3: Copia e cola");
  rl.question("Escolha uma opção: ", (escolha) => {
    switch (parseInt(escolha)) {
      case 1:
        pixQRCode(cliente, rl, menu);
        break;
      case 2:
        pixChave(cliente, rl, menu);
        break;
      case 3:
        pixCopiaCola(cliente, rl, menu);
        break;
      default:
        console.log("Opção inválida.");
        menu(cliente);
        break;
    }
  });
}

module.exports = realizarPix;
