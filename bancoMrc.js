const readline = require("readline");
const enviarEmail = require("./enviarEmail");
const gerarContrato = require("./contrato");
const { menuEmprestimosImobiliario } = require("./emprestimoImobiliario");
const { menuEmprestimsoConsignado } = require("./emprestimoImobiliario");
const { menuEmprestimosFGTS } = require("./emprestimoFGTS");
const { menuEmprestimosPessoal } = require("./emprestimoPessoal");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let saldo = gerarSaldoAleatorio();
let senha = "1234";

function gerarSaldoAleatorio() {
  return (Math.random() * 10000).toFixed(2);
}

function pedirSenha(callback) {
  rl.question("Digite a senha: ", (inputSenha) => {
    if (inputSenha === senha) {
      console.log("Senha correta.");
      callback();
    } else {
      console.log("Senha incorreta. Acesso negado.");
      rl.close();
    }
  });
}

function exibirMensagemBoasVindas() {
  console.log("\nBem-vindo ao Banco Mrc81!");
  console.log("\nPor favor, insira o cartão.");
  pedirSenha(menu);
}

function contagemRegressiva(segundos, callback) {
  console.log(`\nAguarde ${segundos} segundos...`);
  let intervalo = setInterval(() => {
    segundos--;
    if (segundos === 0) {
      clearInterval(intervalo);
      callback();
    } else {
      console.log(`${segundos}...`);
    }
  }, 1000);
}

function gerarCodigoDeBarras() {
  const codigo = Math.floor(1000000000000 + Math.random() * 9000000000000);
  return codigo.toString();
}

function extrairUltimosTresDigitos(codigoBarras) {
  if (codigoBarras.length >= 3) {
    return codigoBarras.slice(-3);
  }
  return null;
}

function menu() {
  console.log("\nMenu:");
  console.log(`Saldo atual: R$ ${saldo}`);
  console.log("\n1: Depositar");
  console.log("2: Sacar");
  console.log("3: Pagar conta");
  console.log("4: Pix");
  console.log("5: Outros");
  console.log("0: Encerrar");
  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (parseInt(opcao)) {
      case 1:
        depositar();
        break;
      case 2:
        sacar();
        break;
      case 3:
        pagarConta();
        break;
      case 4:
        pix();
        break;
      case 5:
        menuOutros();
        break;
      case 0:
        encerrarPrograma();
        break;
      default:
        console.log("\nOpção inválida. Tente novamente.");
        menu();
        break;
    }
  });
}

function depositar() {
  rl.question("Digite o valor a ser depositado: ", (valor) => {
    let valorDepositado = parseFloat(valor);
    if (isNaN(valorDepositado) || valorDepositado <= 0) {
      console.log("Valor inválido. Tente novamente.");
      depositar();
      return;
    }
    contagemRegressiva(3, () => {
      saldo = (parseFloat(saldo) + valorDepositado).toFixed(2);
      console.log("\nValor depositado com sucesso!");
      console.log(`Saldo atualizado: R$ ${saldo}`);
      menu();
    });
  });
}

function sacar() {
  rl.question("Digite o valor a ser sacado: ", (valor) => {
    let valorSacado = parseFloat(valor);
    if (isNaN(valorSacado) || valorSacado <= 0) {
      console.log("Valor inválido. Tente novamente.");
      sacar();
      return;
    }
    if (valorSacado > saldo) {
      console.log("Saldo insuficiente para realizar o saque.");
      menu();
      return;
    }
    contagemRegressiva(3, () => {
      saldo = (parseFloat(saldo) - valorSacado).toFixed(2);
      console.log("Valor sacado com sucesso!");
      menu();
    });
  });
}

function pagarConta() {
  rl.question("Pressione Enter para ler o código de barras:", () => {
    let codigo = gerarCodigoDeBarras();
    let valorConta = extrairUltimosTresDigitos(codigo);
    if (!valorConta) {
      console.log("Não foi possível determinar o valor da conta.");
      menu();
      return;
    }
    let valorPagamento = (parseFloat(valorConta) / 100).toFixed(2);
    console.log(`Valor da conta: R$ ${valorPagamento}`);
    rl.question(
      "\n1: Confirmar pagamento\n2: Valor incorreto\nEscolha uma opção: ",
      (confirmacao) => {
        if (confirmacao === "1") {
          pedirSenha(() => {
            if (valorPagamento <= saldo) {
              saldo = (parseFloat(saldo) - valorPagamento).toFixed(2);
              console.log("Pagamento realizado com sucesso.");
            } else {
              console.log("Saldo insuficiente para realizar esse pagamento.");
            }
            menu();
          });
        } else {
          menu();
        }
      }
    );
  });
}

function pix() {
  console.log("\nEscolha uma opção de pagamento com Pix:");
  console.log("1: QR code");
  console.log("2: Chave Pix");
  console.log("3: Copia e cola");
  rl.question("Escolha uma opção: ", (escolha) => {
    switch (parseInt(escolha)) {
      case 1:
        let codigoQR = gerarCodigoDeBarras();
        console.log("Código QR gerado: " + codigoQR);
        rl.question("Digite o valor a ser transferido: ", (valor) => {
          let valorTransferido = parseFloat(valor);
          if (isNaN(valorTransferido) || valorTransferido <= 0) {
            console.log("Valor inválido. Tente novamente.");
            pix();
            return;
          }
          pedirSenha(() => {
            saldo = (parseFloat(saldo) - valorTransferido).toFixed(2);
            console.log("Transferência via QR code realizada com sucesso!");
            enviarEmail(
              "seu_email@gmail.com",
              "Transferência via QR code",
              `Você recebeu uma transferência via QR code no valor de R$ ${valorTransferido.toFixed(
                2
              )}.`
            );
            menu();
          });
        });
        break;
      case 2:
        rl.question(
          "Digite a chave Pix (CPF, e-mail ou número de celular): ",
          (chavePix) => {
            if (
              chavePix.match(/\d{11}/) ||
              chavePix.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
            ) {
              rl.question("Digite o valor a ser transferido: ", (valor) => {
                let valorTransferido = parseFloat(valor);
                pedirSenha(() => {
                  saldo = (parseFloat(saldo) - valorTransferido).toFixed(2);
                  console.log(
                    "Transferência via Chave Pix realizada com sucesso!"
                  );
                  if (
                    chavePix.match(
                      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
                    )
                  ) {
                    enviarEmail(
                      chavePix,
                      "Transferência via Pix",
                      `Você recebeu uma transferência via Pix no valor de R$ ${valorTransferido.toFixed(
                        2
                      )}.`
                    );
                  }
                  menu();
                });
              });
            } else {
              console.log("Chave Pix inválida.");
              menu();
            }
          }
        );
        break;
      case 3:
        rl.question(
          "Digite o código de Copia e Cola para transferência: ",
          (codigoCopiaCola) => {
            let valorTransferido = parseFloat(codigoCopiaCola.slice(-2));
            if (isNaN(valorTransferido) || valorTransferido <= 0) {
              console.log("Valor inválido. Tente novamente.");
              pix();
              return;
            }
            pedirSenha(() => {
              saldo = (parseFloat(saldo) - valorTransferido).toFixed(2);
              console.log(
                "Transferência via Copia e Cola realizada com sucesso!"
              );
              menu();
            });
          }
        );
        break;
      default:
        console.log("Opção inválida.");
        menu();
        break;
    }
  });
}

function menuOutros() {
  console.log("\nEscolha uma opção:");
  console.log("1: Empréstimo Pessoal");
  console.log("2: Empréstimo Consignado");
  console.log("3: Empréstimo Imobiliário");
  console.log("4: Empréstimo FGTS");
  console.log("5: Voltar ao menu principal");
  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (parseInt(opcao)) {
      case 1:
        const { menuEmprestimos } = require("./emprestimoPessoal");
        menuEmprestimos(rl, retornarAoMenuPrincipal);
        menuOutros();
        break;
      case 2:
        const { menuEmprestimsoConsignado } = require("./emprestimoConsignado");
        menuEmprestimsoConsignado(rl, retornarAoMenuPrincipal);
        menuOutros();
        break;
      case 3:
        const {
          menuEmprestimosImobiliario,
        } = require("./emprestimoImobiliario");
        menuEmprestimosImobiliario(rl, retornarAoMenuPrincipal);
        menuOutros();
        break;
      case 4:
        const { menuEmprestimosFGTS } = require("./emprestimoFGTS");
        menuEmprestimosFGTS(rl, retornarAoMenuPrincipal);
        menuOutros();
        break;
      case 5:
        menu();
        break;
      default:
        console.log("Opção inválida.");
        retornarAoMenuPrincipal(); // Retorna ao menu principal em caso de opção inválida
        break;
    }
  });
}

function encerrarPrograma() {
  console.log("\nEncerrando o programa...");
  rl.close();
  process.exit(0);
}
function retornarAoMenuPrincipal() {
  console.log("\nRetornando ao menu principal...");
  menu(); // Espera 2 segundos e volta ao menu principal
}

exibirMensagemBoasVindas();
