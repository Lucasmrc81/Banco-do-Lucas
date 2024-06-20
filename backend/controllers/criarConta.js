const fs = require("fs");
const readline = require("readline");
const axios = require("axios");
const { enviarEmail } = require("./enviarEmail");
const { gerarMensagemBoasVindas } = require("./mensagemBoasVindas");
const { gerarPIN, salvarPIN, lerPIN } = require("../seguranca/pinManager");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function obterEnderecoPorCEP(cep) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter endereço pelo CEP:", error);
    return null;
  }
}

function gerarNumeroConta(clientes) {
  const numeroContaAtual = clientes.length + 1;
  const numeroContaFormatado = numeroContaAtual.toString().padStart(5, "0");
  const digitoVerificador = calcularDigitoVerificador(numeroContaFormatado);
  return `${numeroContaFormatado}-${digitoVerificador}`;
}

function calcularDigitoVerificador(numeroContaFormatado) {
  const pesos = [2, 3, 4, 5, 6];
  let soma = 0;
  for (let i = 0; i < numeroContaFormatado.length; i++) {
    soma += parseInt(numeroContaFormatado[i]) * pesos[i];
  }
  const resto = soma % 11;
  const dv = resto < 2 ? 0 : 11 - resto;
  return dv.toString();
}

function criarConta(clientes, callback) {
  let novoCliente = {};

  rl.question("Digite o CPF (11 dígitos): ", (cpf) => {
    if (cpf.length === 11 && /^\d+$/.test(cpf)) {
      novoCliente.cpf = cpf;
      rl.question("Digite o nome: ", (nome) => {
        novoCliente.nome = nome;
        rl.question("Digite o sobrenome: ", (sobrenome) => {
          novoCliente.sobrenome = sobrenome;
          rl.question("Digite o e-mail: ", (email) => {
            novoCliente.email = email;
            rl.question("Digite o CEP: ", async (cep) => {
              const endereco = await obterEnderecoPorCEP(cep);
              if (endereco && !endereco.erro) {
                novoCliente.endereco = {
                  rua: endereco.logradouro,
                  numero: "",
                  bairro: endereco.bairro,
                  cidade: endereco.localidade,
                  estado: endereco.uf,
                  cep: cep,
                };
                rl.question("Digite o número: ", (numero) => {
                  novoCliente.endereco.numero = numero;
                  rl.question("Digite a senha: ", (senha) => {
                    rl.question("Confirme a senha: ", (confirmacaoSenha) => {
                      if (senha !== confirmacaoSenha) {
                        console.log(
                          "As senhas não coincidem. Tente novamente."
                        );
                        criarConta(clientes, callback);
                        return;
                      }

                      novoCliente.senha = senha;

                      // Gerar e salvar o PIN de verificação
                      const pin = gerarPIN();
                      salvarPIN(pin);

                      console.log(
                        "\nAguarde até 2 horas para a criação da conta..."
                      );

                      setTimeout(() => {
                        novoCliente.agencia = "001";
                        novoCliente.conta = gerarNumeroConta(clientes);

                        clientes.push(novoCliente);
                        fs.writeFile(
                          "data/clientes.json",
                          JSON.stringify(clientes, null, 2),
                          (err) => {
                            if (err) {
                              console.error(
                                "Erro ao salvar os dados do cliente:",
                                err
                              );
                            } else {
                              console.log("Conta criada com sucesso!");

                              // Enviar e-mail de boas-vindas após 2 horas
                              const mensagemBoasVindas =
                                gerarMensagemBoasVindas(
                                  `${novoCliente.nome} ${novoCliente.sobrenome}`
                                );
                              enviarEmail(
                                novoCliente.email,
                                "Confirmação de Criação de Conta",
                                mensagemBoasVindas
                              );
                            }
                            callback();
                          }
                        );
                      }, 7200000); // 2 horas em milissegundos
                    });
                  });
                });
              } else {
                console.log("CEP inválido. Tente novamente.");
                criarConta(clientes, callback);
              }
            });
          });
        });
      });
    } else {
      console.log("CPF inválido. Tente novamente.");
      criarConta(clientes, callback);
    }
  });
}

module.exports = { criarConta };
