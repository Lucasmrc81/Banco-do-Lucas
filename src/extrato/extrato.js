const fs = require("fs");

function gerarExtrato(cliente) {
  const data = new Date();
  const extrato = `
  Extrato Bancário
  Nome: ${cliente.nome}
  CPF: ${cliente.cpf}
  Data: ${data.toLocaleDateString()} ${data.toLocaleTimeString()}
  Saldo Atual: R$ ${cliente.saldo}
  `;
  const fileName = `extrato_${cliente.cpf}_${data.getTime()}.txt`;
  fs.writeFile(`data/extratos/${fileName}`, extrato, (err) => {
    if (err) throw err;
    console.log("Extrato gerado com sucesso:", fileName);
  });
}

module.exports = gerarExtrato;
