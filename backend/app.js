const fs = require("fs");
const readline = require("readline");
const { criarConta } = require("./controllers/criarConta");
const { enviarEmail } = require("./controllers/enviarEmail");
const { gerarContrato } = require("./controllers/contrato");
const {} = require("./controllers/mensagemBoasVindas");
const {
  realizarOperacaoFinanceira,
} = require("./controllers/operacoesFinanceiras");
const {
  menuEmprestimosImobiliario,
} = require("./emprestimo/emprestimoImobiliario");
const {
  menuEmprestimosConsignado,
} = require("./emprestimo/emprestimoConsignado");
const { menuEmprestimosFGTS } = require("./emprestimo/emprestimoFGTS");
const { menuEmprestimosPessoal } = require("./emprestimo/emprestimoPessoal");
const { verificarPrimeirosDigitos } = require("./seguranca/senhaManager");
const { obterPIN } = require("./seguranca/pinManager");
const trocarSenha = require("./seguranca/trocarDeSenha");
const realizarPix = require("./pix/pix");

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
});

function gerarSaldoAleatorio() {
  return (Math.random() * 10000).toFixed(2);
}

function exibirMensagemBoasVindasConsole() {
  console.log("nBem-vindo ao Mrc81 Bank !");
}

function exibirMenuInicial() {
  console.log("\n1: Fazer Login");
  console.log("2: Criar Conta");
  rl.question("\nEscolha uma opção: ", (opcao) => {
    switch (parseInt(opcao)) {
      case 1:
        pedirCPF();
        break;
      case 2:
        criarConta(clientes, exibirMenuInicial);
        break;
      default:
        console.log("\nOpção inválida. Tente novamente.");
        exibirMenuInicial();
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
        pedirSenha(cliente, exibirMenuCliente);
      } else {
        console.log("CPF não encontrado. Tente novamente.");
        pedirCPF(); // Chamada recursiva aqui pode ser o problema se não controlada
      }
    } else {
      console.log("CPF inválido. Tente novamente.");
      pedirCPF(); // Outra chamada recursiva aqui também pode ser problemática
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
      exibirMenuInicial(); // Voltar ao menu inicial após senha incorreta
    }
  });
}

function exibirMenuCliente(cliente) {
  console.log(`\nBem-vindo, ${cliente.nome}`);
  console.log(`Seu saldo é de R$ ${cliente.saldo}`);
  menu(cliente);
}

function menu(cliente) {
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
        realizarSaque(cliente);
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

function realizarSaque(cliente) {
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
    cliente.saldo = (parseFloat(cliente.saldo) - valorSacado).toFixed(2);
    console.log("Valor sacado com sucesso!");
    menu(cliente);
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
          pedirSenha(cliente, () => {
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
        menuEmprestimosConsignado(rl, () => menu(cliente));
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
        menuOutros(cliente);
        break;
    }
  });
}

function solicitarNovaSenha(cliente) {
  rl.question("Digite a nova senha: ", (novaSenha) => {
    definirSenha(cliente, novaSenha);
    console.log("Senha alterada com sucesso.");
    menu(cliente);
  });
}

function encerrarPrograma() {
  console.log("Obrigado por usar o Mrc81 Bank. Até a próxima!");
  rl.close();
}

// Iniciar o programa
function iniciarPrograma() {
  exibirMensagemBoasVindasConsole();
  exibirMenuInicial();
}

// Função principal de execução
iniciarPrograma();
