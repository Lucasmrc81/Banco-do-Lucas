const readline = require("readline");
const enviarEmail = require("./enviarEmail"); // Importa a função enviarEmail
const gerarContrato = require("./contrato"); // Importa a função gerarContrato do arquivo contrato.js

function calcularTaxaJuros(prazoMeses) {
  if (prazoMeses <= 12) {
    return 0.0119; // 1.19% ao mês para até 12 meses
  } else if (prazoMeses <= 24) {
    return 0.0126; // 1.26% ao mês para até 24 meses
  } else if (prazoMeses <= 36) {
    return 0.0137; // 1.37% ao mês para até 36 meses
  } else {
    return 0.0159; // 1.59% ao mês para mais de 48 meses
  }
}

function exibirTabelaCondicoes(valorEmprestimo) {
  const prazos = [12, 24, 36, 48];

  let condicoes = `\n
Condições de Empréstimo Pessoal para R$ ${valorEmprestimo.toFixed(2)}
Prazo (meses)   |       Taxa de Juros (%)   |       Valor da Parcela (R$)   |       Total a Pagar (R$)
------------------------------------------------------------------------------------------------\n`;

  for (let i = 0; i < prazos.length; i++) {
    let taxaJuros = calcularTaxaJuros(prazos[i]);
    let valorParcela = calcularValorParcela(
      valorEmprestimo,
      prazos[i],
      taxaJuros
    );
    let totalPagar = valorParcela * prazos[i];

    condicoes += `${prazos[i]}              |       ${(taxaJuros * 100).toFixed(
      2
    )}              |       ${valorParcela.toFixed(
      2
    )}          |       ${totalPagar.toFixed(2)}\n`;
  }

  condicoes += `------------------------------------------------------------------------------------------------\n\n`;

  console.log(condicoes);
}

function calcularValorParcela(valorEmprestimo, prazoMeses, taxaJuros) {
  let valorParcela =
    (valorEmprestimo * taxaJuros) / (1 - Math.pow(1 + taxaJuros, -prazoMeses));
  return valorParcela;
}

function gerarPin() {
  return Math.floor(1000 + Math.random() * 9000); // Gera um PIN de 4 dígitos
}

function solicitarEmprestimo(valorEmprestimo, email, cpf, callback) {
  const sucesso = Math.random() < 0.99; // Simulando sucesso aleatório (70% de chance)
  if (sucesso) {
    callback(true);
  } else {
    console.log(
      "No momento não foi aprovado empréstimo em seu CPF! Peço que tente em alguns dias."
    );
    callback(false);
  }
}

function contagemRegressiva(segundos, callback) {
  if (segundos > 0) {
    console.log(`Aguarde ${segundos} segundos...`);
    setTimeout(() => {
      contagemRegressiva(segundos - 1, callback);
    }, 1000);
  } else {
    callback();
  }
}

function menuEmprestimos(rl, menuPrincipalCallback) {
  rl.question("\nDigite o valor do empréstimo: ", (valor) => {
    let valorEmprestimo = parseFloat(valor.replace(",", "."));
    if (isNaN(valorEmprestimo) || valorEmprestimo < 100) {
      console.log("\nValor inválido. Tente novamente.");
      menuEmprestimos(rl, menuPrincipalCallback); // Chamada recursiva correta
    } else {
      exibirTabelaCondicoes(valorEmprestimo);
      rl.question("\nDigite seu e-mail para envio do contrato: ", (email) => {
        rl.question("\nDigite seu CPF: ", (cpf) => {
          rl.question(
            "\nEscolha o prazo do empréstimo (12, 24, 36, 48 meses): ",
            (prazo) => {
              let prazoEmprestimo = parseInt(prazo);
              if (![12, 24, 36, 48].includes(prazoEmprestimo)) {
                console.log("Prazo inválido. Tente novamente.");
                menuEmprestimos(rl, menuPrincipalCallback); // Chamada recursiva correta
              } else {
                rl.question(
                  "\nEscolha o melhor dia para pagamento (05, 08, 15, 16, 23, 29, 30): ",
                  (dia) => {
                    let diaVencimento = parseInt(dia);
                    if (![5, 8, 15, 16, 23, 29, 30].includes(diaVencimento)) {
                      console.log(
                        "Dia de vencimento inválido. Tente novamente."
                      );
                      menuEmprestimos(rl, menuPrincipalCallback); // Chamada recursiva correta
                    } else {
                      const taxaJuros = calcularTaxaJuros(prazoEmprestimo); // Taxa de juros variável
                      const tipoEmprestimo = "Pessoal"; // Exemplo de tipo de empréstimo
                      const garantia = "Nenhuma"; // Exemplo de garantia
                      const valorParcela = calcularValorParcela(
                        valorEmprestimo,
                        prazoEmprestimo,
                        taxaJuros
                      );

                      solicitarEmprestimo(
                        valorEmprestimo,
                        email,
                        cpf,
                        (sucesso) => {
                          if (sucesso) {
                            const pin = gerarPin();
                            enviarEmail(
                              email,
                              "\nPIN de Confirmação",
                              `Seu PIN de confirmação é: ${pin}`
                            );
                            console.log(
                              "\nEmpréstimo pré-aprovado! Um PIN de confirmação foi enviado para seu e-mail."
                            );

                            rl.question(
                              "\nDigite o PIN recebido por e-mail: ",
                              (inputPin) => {
                                if (parseInt(inputPin) === pin) {
                                  rl.question(
                                    "\nDigite sua senha para confirmar: ",
                                    (senhaFinal) => {
                                      // Aqui você pode adicionar lógica para verificar a senha final
                                      let contrato = gerarContrato(
                                        valorEmprestimo,
                                        cpf,
                                        prazoEmprestimo,
                                        taxaJuros,
                                        tipoEmprestimo,
                                        garantia,
                                        valorParcela,
                                        diaVencimento
                                      );
                                      enviarEmail(
                                        email,
                                        "Contrato de Empréstimo",
                                        contrato
                                      ); // Enviar o contrato por email
                                      contagemRegressiva(3, () => {
                                        saldo = (
                                          parseFloat(saldo) + valorDepositado
                                        ).toFixed(2);
                                        console.log(
                                          "Empréstimo solicitado com sucesso!"
                                        );
                                        menuPrincipalCallback();
                                      });
                                    }
                                  );
                                } else {
                                  console.log(
                                    "PIN incorreto. Tente novamente."
                                  );
                                  menuEmprestimos(rl, menuPrincipalCallback);
                                }
                              }
                            );
                          } else {
                            console.log("Falha ao solicitar empréstimo.");
                            menuPrincipalCallback();
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        });
      });
    }
  });
}

module.exports = {
  menuEmprestimos,
};
