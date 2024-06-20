const fs = require("fs");

function gerarPIN() {
  const pin = Math.floor(1000 + Math.random() * 9000); // Gera um número aleatório entre 1000 e 9999
  return pin.toString();
}

function salvarPIN(pin) {
  fs.writeFile("data/pin.txt", pin, (err) => {
    if (err) {
      console.error("Erro ao salvar o PIN:", err);
    } else {
      console.log("PIN gerado e salvo com sucesso.");
    }
  });
}

function lerPIN(callback) {
  fs.readFile("data/pin.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o PIN:", err);
      callback(null);
    } else {
      callback(data.trim()); // Retorna o PIN lido removendo espaços em branco
    }
  });
}

module.exports = { gerarPIN, salvarPIN, lerPIN };
