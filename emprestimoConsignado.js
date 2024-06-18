const readline = require("readline");
const enviarEmail = require("./enviarEmail"); // Importa a função enviarEmail
const gerarContrato = require("./contrato"); // Importa a função gerarContrato do arquivo contrato.js

function calcularTaxaJuros(prazoMeses) {
  if (prazoMeses <= 60) {
    return 0.0104; // 1.04% ao mês para até 60 meses
  } else if (prazoMeses <= 120) {
    return 0.0121; // 1.21% ao mês para até 120 meses
  } else {
    return 0.0132; // 1.32% ao mês para mais de 120 meses
  }
}

function exibirTabelaCondicoes(valorEmprestimo) {
  const prazos = [60, 120, 180];

  let condicoes = `\n
Condições de Empréstimo Imobiliário para R$ ${valorEmprestimo.toFixed(2)}
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
  const sucesso = Math.random() < 0.7; // Simulando sucesso aleatório (70% de chance)
  callback(sucesso);
}

function menuEmprestimosImobiliario(rl, menuPrincipalCallback) {
  rl.question("Digite o valor do empréstimo: ", (valor) => {
    let valorEmprestimo = parseFloat(valor.replace(",", "."));
    if (isNaN(valorEmprestimo) || valorEmprestimo < 100) {
      console.log("Valor inválido. Tente novamente.");
      menuEmprestimosImobiliario(rl, menuPrincipalCallback); // Chamada recursiva correta
    } else {
      exibirTabelaCondicoes(valorEmprestimo);
      rl.question("Digite seu e-mail para envio do contrato: ", (email) => {
        rl.question("Digite seu CPF: ", (cpf) => {
          rl.question(
            "Escolha o prazo do empréstimo (60, 120, 180 meses): ",
            (prazo) => {
              let prazoEmprestimo = parseInt(prazo);
              if (![60, 120, 180].includes(prazoEmprestimo)) {
                console.log("Prazo inválido. Tente novamente.");
                menuEmprestimosImobiliario(rl, menuPrincipalCallback); // Chamada recursiva correta
              } else {
                rl.question(
                  "Escolha o melhor dia para pagamento (05, 08, 15, 16, 23, 29, 30): ",
                  (dia) => {
                    let diaVencimento = parseInt(dia);
                    if (![5, 8, 15, 16, 23, 29, 30].includes(diaVencimento)) {
                      console.log(
                        "Dia de vencimento inválido. Tente novamente."
                      );
                      menuEmprestimosImobiliario(rl, menuPrincipalCallback); // Chamada recursiva correta
                    } else {
                      const taxaJuros = calcularTaxaJuros(prazoEmprestimo); // Taxa de juros variável
                      const tipoEmprestimo = "Imobiliário"; // Tipo de empréstimo
                      const garantia = "Imóvel"; // Garantia exigida
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
                              "PIN de Confirmação",
                              `Seu PIN de confirmação é: ${pin}`
                            );
                            console.log(
                              "Empréstimo pré-aprovado! Um PIN de confirmação foi enviado para seu e-mail."
                            );

                            rl.question(
                              "Digite o PIN recebido por e-mail: ",
                              (inputPin) => {
                                if (parseInt(inputPin) === pin) {
                                  rl.question(
                                    "Digite sua senha para confirmar: ",
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
                                      console.log(
                                        "Empréstimo solicitado com sucesso!"
                                      );
                                      menuPrincipalCallback();
                                    }
                                  );
                                } else {
                                  console.log(
                                    "PIN incorreto. Tente novamente."
                                  );
                                  menuEmprestimosImobiliario(
                                    rl,
                                    menuPrincipalCallback
                                  );
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
  menuEmprestimosImobiliario,
};
