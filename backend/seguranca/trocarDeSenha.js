// arquivo: controllers/trocarSenha.js

const fs = require("fs");
const path = require("path");

const CLIENTE_FILE = path.join(__dirname, "../data/cliente.json");

function alterarSenha(cpf, novaSenha) {
  try {
    // Carregar dados atuais dos clientes
    const data = JSON.parse(fs.readFileSync(CLIENTE_FILE, "utf8"));
    const clientes = data.clientes;

    // Procurar o cliente pelo CPF
    const clienteIndex = clientes.findIndex((cliente) => cliente.cpf === cpf);
    if (clienteIndex === -1) {
      throw new Error("Cliente não encontrado");
    }

    // Alterar a senha do cliente
    clientes[clienteIndex].senha = novaSenha;

    // Salvar os dados atualizados no arquivo
    fs.writeFileSync(CLIENTE_FILE, JSON.stringify(data, null, 2), "utf8");

    return {
      sucesso: true,
      mensagem: "Senha alterada com sucesso",
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: `Erro ao alterar senha: ${error.message}`,
    };
  }
}

module.exports = alterarSenha;
