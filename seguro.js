const { rl, taxaJurosMax, taxaJurosMin, saldo, emprestimo, menuOutros, enviarSms } = require("./bancoMrc");

function solicitarEmprestimo() {
  rl.question("Digite o valor do emprestimo: ", (valor) => {
    let valorEmprestimo = parseFloat(valor);
    rl.question("Digite a quantidade de parcelas: ", (prazo) => {
      let prazoEmprestimo, parseInt; (prazo);
      let taxaJuos = Math.random() * (taxaJurosMax - taxaJurosMin) + taxaJurosMin;
      saldo = (parseFloat(saldo) + valorEmprestimo).toFixed(2);
      console.log(`Emprestimo de R$ ${valorEmprestimo.toFixed(2)} comcedido com sucesso!`);
      console.log(`Valor final a ser pago após ${prazoEmprestimo} meses: R$ ${valorFinal.toFixed(2)}`);
      emprestimo();
    });
  });
}
exports.solicitarEmprestimo = solicitarEmprestimo;
function ();
function seguro() {
  console.log("\nMenu de Seguros:");
  console.log("1: Seguro de Vida");
  console.log("2: Seguro Residencial");
  console.log("3: Seguro Automóvel");
  console.log("0: Voltar ao menu anterior");
  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (parseInt(opcao)) {
      case 1:
        console.log("Você escolheu Seguro de Vida.");
        break;
      case 2:
        console.log("Você escolheu Seguro Residencial.");
        break;
      case 3:
        console.log("Você escolheu Seguro Automóvel.");
        break;
      case 0:
        menuOutros();
        break;
      default:
        console.log("\nOpção inválida. Tente novamente.");
        seguro();
        break;
    }
  });
}
exports.seguro = seguro;
function investimentos() {
  console.log("\nMenu de Investimentos:");
  console.log("1: Investimento em Ações");
  console.log("2: Investimento em Fundos Imobiliários");
  console.log("3: Poupança");
  console.log("0: Voltar ao menu anterior");
  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (parseInt(opcao)) {
      case 1:
        console.log("Você escolheu Investimento em Ações.");
        break;
      case 2:
        console.log("Você escolheu Investimento em Fundos Imobiliários.");
        break;
      case 3:
        console.log("Você escolheu Poupança.");
        break;
      case 0:
        menuOutros();
        break;
      default:
        console.log("\nOpção inválida. Tente novamente.");
        investimentos();
        break;
    }
  });
}
exports.investimentos = investimentos;
function recargaCelular() {
  console.log("\nMenu de Recarga de Celular:");
  rl.question("Digite o número do celular (apenas números): ", (numero) => {
    if (numero.match(/^\d{10,11}$/)) {
      rl.question("Digite o valor da recarga: ", (valor) => {
        let valorRecarga = parseFloat(valor);
        if (valorRecarga <= saldo) {
          saldo = (parseFloat(saldo) - valorRecarga).toFixed(2);
          console.log(
            `Recarga de R$ ${valorRecarga.toFixed(
              2
            )} realizada com sucesso no número ${numero}.`
          );
          enviarSms(
            `Sua recarga de R$ ${valorRecarga.toFixed(
              2
            )} foi realizada com sucesso!`,
            `+55${numero}`
          );
        } else {
          console.log("Saldo insuficiente para realizar a recarga.");
        }
        menuOutros();
      });
    } else {
      console.log("Número de celular inválido. Tente novamente.");
      recargaCelular();
    }
  });
}
exports.recargaCelular = recargaCelular;
function simularEmprestimo() {
  rl.question("Digite o valor do empréstimo: ", (valor) => {
    let valorEmprestimo = parseFloat(valor);
    rl.question("Digite o prazo em meses: ", (prazo) => {
      let prazoEmprestimo = parseInt(prazo);
      let valorFinal = valorEmprestimo * Math.pow(1 + taxaBaseJuros, prazoEmprestimo);
      console.log(
        `Valor final a ser pago após ${prazoEmprestimo} meses: R$ ${valorFinal.toFixed(
          2
        )}`
      );
      emprestimo();
    });
  });
}
exports.simularEmprestimo = simularEmprestimo;
function solicitarEmprestimo() {
  rl.question("Digite o valor do empréstimo: ", (valor) => {
    let valorEmprestimo = parseFloat(valor);
    rl.question("Digite o prazo em meses: ", (prazo) => {
      let prazoEmprestimo = parseInt(prazo);
      let valorFinal = valorEmprestimo * Math.pow(1 + taxaBaseJuros, prazoEmprestimo);
      saldo = (parseFloat(saldo) + valorEmprestimo).toFixed(2);
      console.log(
        `Empréstimo de R$ ${valorEmprestimo.toFixed(2)} concedido com sucesso!`
      );
      console.log(
        `Valor final a ser pago após ${prazoEmprestimo} meses: R$ ${valorFinal.toFixed(
          2
        )}`
      );
      emprestimo();
    });
  });
}
exports.solicitarEmprestimo = solicitarEmprestimo;
