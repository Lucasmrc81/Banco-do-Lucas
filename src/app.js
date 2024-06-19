const fs = require("fs");
const readline = require("readline");
const { criarConta } = require("./controllers/criarConta");
const { enviarEmail } = require("./controllers/enviarEmail");
const { gerarContrato } = require("../contrato");
const { menuEmprestimosImobiliario } = require("../emprestimoImobiliario");
const { menuEmprestimsoConsignado } = require("../emprestimoConsignado");
const { menuEmprestimosFGTS } = require("../emprestimoFGTS");
const { menuEmprestimosPessoal } = require("../emprestimoPessoal");
const { gerarPIN, obterPIN } = require("./controllers/pinManager");
const {
  definirSenha,
  verificarSenhaCompleta,
  verificarPrimeirosDigitos,
} = require("./controllers/senhaManager");
const trocarSenha = require("./controllers/trocaDeSenha");
const realizarPix = require("./controllers/pix");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let saldo = gerarSaldoAleatorio();
let clientes;

fs.readFile("data/clientes.json", "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo clientes.json:", err);
    return;
  }
  clientes = JSON.parse(data);
  exibirMensagemBoasVindas();
});

function gerarSaldoAleatorio() {
  return (Math.random() * 10000).toFixed(2);
}

function exibirMensagemBoasVindas() {
  console.log("\nBem-vindo ao Banco Mrc81!");
  exibirMensagemInicial();
}

function exibirMensagemInicial() {
  console.log("\n1: Fazer Login");
  console.log("2: Criar Conta");
  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (parseInt(opcao)) {
      case 1:
        pedirCPF();
        break;
      case 2:
        criarConta(clientes, exibirMensagemInicial);
        break;
      default:
        console.log("\nOpção inválida. Tente novamente.");
        exibirMensagemInicial();
        break;
    }
  });
}

function pedirCPF() {
  rl.question("Digite o CPF (11 dígitos): ", (inputCPF) => {
    if (inputCPF.length === 11 && /^\d+$/.test(inputCPF)) {
      const cliente = clientes.find((cliente) => cliente.cpf === inputCPF);
      if (cliente) {
        console.log("CPF válido.");
        pedirSenha(cliente, menu);
      } else {
        console.log("CPF não encontrado. Tente novamente.");
        pedirCPF();
      }
    } else {
      console.log("CPF inválido. Tente novamente.");
      pedirCPF();
    }
  });
}

function pedirSenha(cliente, callback) {
  rl.question("Digite a senha: ", (inputSenha) => {
    if (verificarSenhaCompleta(cliente, inputSenha)) {
      console.log("Senha correta.");
      callback(cliente);
    } else {
      console.log("Senha incorreta. Acesso negado.");
      rl.close();
    }
  });
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
  } else {
    return null;
  }
}

function menu(cliente) {
  console.log(`\nBem-vindo, ${cliente.nome}`);
  console.log(`Seu saldo é de R$ ${cliente.saldo}`);
  console.log("\nEscolha uma opção:");
  console.log("1: Saldo");
  console.log("2: Extrato");
  console.log("3: Saque");
  console.log("4: Transferência");
  console.log("5: Pagamento");
  console.log("6: PIX");
  console.log("7: Outros serviços");
  console.log("8: Trocar Senha");
  console.log("9: Sair");
  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (parseInt(opcao)) {
      case 1:
        console.log(`Seu saldo atual é de R$ ${cliente.saldo}`);
        menu(cliente);
        break;
      case 2:
        console.log("Em desenvolvimento");
        menu(cliente);
        break;
      case 3:
        rl.question("Digite o valor a ser sacado: ", (valor) => {
          let valorSacado = parseFloat(valor);
          if (isNaN(valorSacado) || valorSacado <= 0) {
            console.log("Valor inválido.");
            menu(cliente);
            return;
          }
          if (valorSacado > cliente.saldo) {
            console.log("Saldo insuficiente para realizar o saque.");
            menu(cliente);
            return;
          }
          contagemRegressiva(3, () => {
            cliente.saldo = (parseFloat(cliente.saldo) - valorSacado).toFixed(
              2
            );
            console.log("Valor sacado com sucesso!");
            menu(cliente);
          });
        });
        break;
      case 4:
        console.log("Em desenvolvimento");
        menu(cliente);
        break;
      case 5:
        pagarConta(cliente);
        break;
      case 6:
        realizarPix(cliente, rl, menu);
        break;
      case 7:
        menuOutros(cliente);
        break;
      case 8:
        solicitarNovaSenha(cliente);
        break;
      case 9:
        encerrarPrograma();
        break;
      default:
        console.log("Opção inválida.");
        menu(cliente);
        break;
    }
  });
}

function pagarConta(cliente) {
  rl.question("Pressione Enter para ler o código de barras:", () => {
    let codigo = gerarCodigoDeBarras();
    let valorConta = extrairUltimosTresDigitos(codigo);
    if (!valorConta) {
      console.log("Não foi possível determinar o valor da conta.");
      menu(cliente);
      return;
    }
    let valorPagamento = (parseFloat(valorConta) / 100).toFixed(2);
    console.log(`Valor da conta: R$ ${valorPagamento}`);
    rl.question(
      "\n1: Confirmar pagamento\n2: Valor incorreto\nEscolha uma opção: ",
      (confirmacao) => {
        if (confirmacao === "1") {
          pedirSenha(cliente, rl, () => {
            if (valorPagamento <= cliente.saldo) {
              cliente.saldo = (
                parseFloat(cliente.saldo) - valorPagamento
              ).toFixed(2);
              console.log("Pagamento realizado com sucesso.");
            } else {
              console.log("Saldo insuficiente para realizar esse pagamento.");
            }
            menu(cliente);
          });
        } else {
          menu(cliente);
        }
      }
    );
  });
}

function menuOutros(cliente) {
  console.log("\nEscolha uma opção:");
  console.log("1: Empréstimo Pessoal");
  console.log("2: Empréstimo Consignado");
  console.log("3: Empréstimo Imobiliário");
  console.log("4: Empréstimo FGTS");
  console.log("5: Voltar ao menu principal");
  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (parseInt(opcao)) {
      case 1:
        menuEmprestimosPessoal(rl, () => menu(cliente));
        break;
      case 2:
        menuEmprestimsoConsignado(rl, () => menu(cliente));
        break;
      case 3:
        menuEmprestimosImobiliario(rl, () => menu(cliente));
        break;
      case 4:
        menuEmprestimosFGTS(rl, () => menu(cliente));
        break;
      case 5:
        menu(cliente);
        break;
      default:
        console.log("Opção inválida.");
        menu(cliente);
        break;
    }
  });
}

function solicitarNovaSenha(cliente) {
  rl.question("Digite a nova senha: ", (novaSenha) => {
    trocarSenha(clientes, cliente.cpf, novaSenha);
    menu(cliente);
  });
}

function encerrarPrograma() {
  console.log("\nEncerrando o programa...");
  rl.close();
  process.exit(0);
}

exibirMensagemBoasVindas();
