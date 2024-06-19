// src/controllers/pinManager.js

const fs = require("fs");

function gerarPIN() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Gera um PIN de 4 dígitos
}

function salvarPIN(cliente, pin) {
  cliente.pin = pin;
  atualizarCliente(cliente);
}

function obterPIN(cliente) {
  return cliente.pin;
}

function verificarPIN(cliente, pin) {
  return cliente.pin === pin;
}

function atualizarCliente(clienteAtualizado) {
  fs.readFile("data/clientes.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo clientes.json:", err);
      return;
    }
    let clientes = JSON.parse(data);
    const index = clientes.findIndex((c) => c.cpf === clienteAtualizado.cpf);
    if (index !== -1) {
      clientes[index] = clienteAtualizado;
      fs.writeFile(
        "data/clientes.json",
        JSON.stringify(clientes, null, 2),
        (err) => {
          if (err) {
            console.error("Erro ao atualizar o arquivo clientes.json:", err);
          } else {
            console.log("PIN atualizado com sucesso.");
          }
        }
      );
    }
  });
}

module.exports = {
  gerarPIN,
  salvarPIN,
  obterPIN,
  verificarPIN,
};
