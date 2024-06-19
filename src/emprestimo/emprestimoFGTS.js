const readline = require("readline");
const enviarEmail = require("../controllers/enviarEmail"); // Importa a função enviarEmail
const gerarContrato = require("./contrato"); // Importa a função gerarContrato do arquivo contrato.js

function exibirTabelaCondicoes() {
  const valoresPredefinidos = [1000, 5000, 10000];

  let condicoes = `\n
Condições de Empréstimo FGTS
Valor do Empréstimo (R$)
----------------------------
`;

  valoresPredefinidos.forEach((valor) => {
    condicoes += `${valor.toFixed(2)}\n`;
  });

  condicoes += `----------------------------\n\n`;

  console.log(condicoes);
}

function solicitarEmprestimo(valorEmprestimo, email, cpf, callback) {
  console.log(
    "Antes de continuar, por favor, autorize o empréstimo no app do FGTS."
  );
  readline.question(
    "Você autorizou o empréstimo no app do FGTS? (s/n): ",
    (resposta) => {
      if (resposta.toLowerCase() !== "s") {
        console.log(
          "Empréstimo cancelado. Por favor, autorize no app do FGTS e tente novamente."
        );
        callback(false);
      } else {
        console.log("Continuando com a solicitação do empréstimo...");

        readline.question(
          "Você deseja continuar com a proposta? (s/n): ",
          (continuar) => {
            if (continuar.toLowerCase() !== "s") {
              console.log("Empréstimo cancelado.");
              callback(false);
            } else {
              const taxaJuros = 0.0; // Taxa de juros não é mostrada
              const prazo = 12; // Prazo fixo de 12 meses
              const garantia = "FGTS";
              const tipoEmprestimo = "FGTS";

              let contrato = gerarContrato(
                valorEmprestimo,
                cpf,
                prazo,
                taxaJuros,
                tipoEmprestimo,
                garantia,
                valorEmprestimo / prazo,
                5
              );

              solicitarEmprestimoConfirmacao(
                valorEmprestimo,
                email,
                cpf,
                contrato,
                callback
              );
            }
          }
        );
      }
    }
  );
}

function solicitarEmprestimoConfirmacao(
  valorEmprestimo,
  email,
  cpf,
  contrato,
  callback
) {
  readline.question("Digite sua senha para confirmar: ", (senhaFinal) => {
    // Aqui você pode adicionar lógica para verificar a senha final
    enviarEmail(email, "Contrato de Empréstimo", contrato); // Enviar o contrato por email
    console.log("Empréstimo solicitado com sucesso!");
    callback(true);
  });
}

function menuEmprestimosFGTS(rl, menuPrincipalCallback) {
  exibirTabelaCondicoes();

  rl.question("Digite o valor do empréstimo: ", (valor) => {
    let valorEmprestimo = parseFloat(valor.replace(",", "."));
    if (isNaN(valorEmprestimo) || valorEmprestimo < 100) {
      console.log("Valor inválido. Tente novamente.");
      menuEmprestimosFGTS(rl, menuPrincipalCallback); // Chamada recursiva correta
    } else {
      rl.question("Digite seu e-mail para envio do contrato: ", (email) => {
        rl.question("Digite seu CPF: ", (cpf) => {
          solicitarEmprestimo(valorEmprestimo, email, cpf, (sucesso) => {
            if (!sucesso) {
              menuPrincipalCallback();
            }
          });
        });
      });
    }
  });
}

module.exports = {
  menuEmprestimosFGTS,
};
