import java.util.Scanner;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.SecureRandom;

public class BancoMrc {
  private static Object senha;

  // Método para exibir a mensagem de boas-vindas
  public static void exibirMensagemBoasVindas() {
    System.out.println("\nBem-vindo ao Banco Mrc81!");
    System.out.println("\nPor favor, insira o cartão.");
    Scanner scanner = new Scanner(System.in);
    scanner.nextLine(); // Espera o usuário pressionar Enter
  }

  // Método para gerar um saldo aleatório
  private static double gerarSaldoAleatorio() {
    SecureRandom random = new SecureRandom();
    return random.nextDouble() * 10000; // Gera um saldo aleatório entre 0 e 10000
  }

  // Método principal do programa
  public static void main(String[] args) {
    // Exibir a mensagem de boas-vindas
    exibirMensagemBoasVindas();
    double saldo = gerarSaldoAleatorio(); // Gerar saldo aleatório
    String senha = "1234";
    File arquivoSenha = new File("senha.txt");

    Scanner scanner = new Scanner(System.in);

    // O restante do seu código vem aqui...

    // Solicitar senha no início
    while (true) {
      System.out.print("Digite a senha para acessar o sistema: ");
      String senhaEntrada = scanner.nextLine();
      if (senhaEntrada.equals(senha)) {
        break;
      } else {
        System.out.println("Senha incorreta. Tente novamente.");
      }
    }

    while (true) {
      System.out.println("\nMenu:");
      System.out.printf("Saldo atual: R$ %.2f\n", saldo);
      System.out.println("\n1: Depositar");
      System.out.println("2: Sacar");
      System.out.println("3: Pagar conta");
      System.out.println("4: Pix");
      System.out.println("5: Outros");
      System.out.println("0: Encerrar");
      System.out.print("\nEscolha uma opção: ");

      int opcao = scanner.nextInt();
      scanner.nextLine(); // Consumindo a nova linha deixada pelo nextInt()

      switch (opcao) {
        case 1:
          saldo = depositar(saldo, scanner);
          break;

        case 2:
          saldo = sacar(saldo, scanner);
          break;

        case 3:
          saldo = pagarConta(saldo, scanner);
          break;

        case 4:
          saldo = Pix(saldo, scanner, senha);
          break;

        case 5:
          saldo = menuOutros(saldo, scanner, arquivoSenha, senha);
          break;

        case 0:
          encerrarPrograma(saldo);
          return;

        default:
          System.out.println("\nOpção inválida. Tente novamente.");
          break;
      }
    }
  }

  private static double depositar(double saldo, Scanner scanner) {
    System.out.print("Digite o valor a ser depositado: ");
    double valorDepositado = scanner.nextDouble();
    scanner.nextLine(); // Consumindo a nova linha deixada pelo nextDouble()

    // Contagem regressiva de 3 segundos
    contagemRegressiva(3);

    saldo += valorDepositado;
    System.out.println("\nValor depositado com sucesso!");
    System.out.printf("Saldo atualiza: R$ %.2f\n", saldo);
    salvarSaldo(saldo);
    return saldo;
  }

  private static void contagemRegressiva(int segundos) {
    try {
      for (int i = segundos; i > 0; i--) { // TODO Auto-generated method stub
        System.err.println("Processando..." + i);
        Thread.sleep(1000);
      }
    } catch (InterruptedException e) {
      System.out.println("Erro na contagem regressiva:" + e.getMessage());
    }
  }

  private static double sacar(double saldo, Scanner scanner) {
    System.out.print("Digite o valor a ser sacado: ");
    double valorSacado = scanner.nextDouble();
    scanner.nextLine(); // Consumindo a nova linha deixada pelo nextDouble()

    if (valorSacado <= saldo) {
      // Contagem regressiva de 3 segundos
      contagemRegressiva(3);

      saldo -= valorSacado;
      System.out.println("Valor sacado com sucesso!");
      salvarSaldo(saldo);
    } else {
      System.out.println("Saldo insuficiente para realizar o saque.");
    }
    return saldo;
  }

  private static double pagarConta(double saldo, Scanner scanner) {
    boolean codigoValido = false;
    double valorPagamento = 0.0;

    while (!codigoValido) {
      System.out.println("Pressione Enter para ler o código de barras:");
      scanner.nextLine(); // Aguarda o pressionamento da tecla Enter

      String codigo = gerarCodigoDeBarras();

      String valorConta = extrairUltimosTresDigitos(codigo);

      if (valorConta != null) {
        valorPagamento = Double.parseDouble(valorConta) / 100.0;

        System.out.printf("Valor da conta: R$ %.2f\n", valorPagamento);
        System.out.println("\n1: Confirmar pagamento");
        System.out.println("2: Valor incorreto");
        System.out.print("\nEscolha uma opção: ");

        int confirmacao = scanner.nextInt();
        scanner.nextLine(); // Consumindo a nova linha deixada pelo nextInt()

        if (confirmacao == 1) {
          if (valorPagamento <= saldo) {
            System.out.print("Digite sua senha para confirmar o pagamento: ");
            String senhaConfirmacao = scanner.nextLine();

            // Verifica se a senha está correta
            if (senhaConfirmacao.equals(senha)) {
              saldo -= valorPagamento;
              salvarSaldo(saldo);
              System.out.println("Pagamento realizado com sucesso.");
            } else {
              System.out.println("Senha incorreta. Pagamento cancelado.");
            }
            codigoValido = true;
          } else {
            System.out.println("Saldo insuficiente para realizar esse pagamento.");
            codigoValido = true; // Sai do loop mesmo com saldo insuficiente
          }
        } else if (confirmacao == 2) {
          // Permite tentar novamente
        } else {
          System.out.println("Opção inválida. Tente novamente.");
        }
      } else {
        System.out.println("Não foi possível determinar o valor da conta.");
      }
    }

    return saldo;
  }

  private static String extrairUltimosTresDigitos(String codigo) {
    if (codigo.length() >= 3) {
      return codigo.substring(codigo.length() - 3);
    } else {
      return null;
    }
  }

  private static void exibirCodigoDeBarras(String codigo) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'exibirCodigoDeBarras'");
  }

  private static int gerarValorAleatorio() {
    SecureRandom random = new SecureRandom();
    // Gera um número aleatório entre 100 e 999
    return random.nextInt(900) + 100;
  }

  private static double Pix(double saldo, Scanner scanner, String senha) {
    System.out.println("\nEscolha uma opção de pagamento com Pix:");
    System.out.println("1: QR code");
    System.out.println("2: Chave Pix");
    System.out.println("3: Copia e cola");

    int escolha = scanner.nextInt();
    scanner.nextLine(); // Consumindo a nova linha deixada pelo nextInt()

    switch (escolha) {
      case 1:
        // Simulação de geração de código QR
        String codigoQR = gerarCodigoDeBarras();
        System.out.println("Código QR gerado: " + codigoQR);

        // Solicitação da senha para prosseguir com o Pix
        System.out.print("Digite a senha para prosseguir com o Pix: ");
        String senhaDigitada = scanner.nextLine();
        if (!senhaDigitada.equals(senha)) {
          System.out.println("Senha incorreta. Operação de Pix cancelada.");
          return saldo;
        }
        System.out.println("Transferência via QR code realizada com sucesso!");
        saldo -= gerarValorAleatorio();
        break;
      case 2:
        System.out.println("Digite a chave Pix (CPF, e-mail ou número de celular): ");
        String chavePix = scanner.nextLine();

        // Verificação do tipo de chave Pix
        if (chavePix.matches("\\d{11}")) { // Verifica se é CPF
          System.out.print("Digite o valor a ser transferido: ");
          double valorTransferido = scanner.nextDouble();
          scanner.nextLine(); // Consumindo a nova linha deixada pelo nextDouble()
          System.out.println("Digite a senha para efetivar a transferência: ");
          senhaDigitada = scanner.nextLine();
          if (!senhaDigitada.equals(senha)) {
            System.out.println("Senha incorreta. Operação de Pix cancelada.");
            return saldo;
          }
          System.out.println("Transferência via Chave Pix (CPF) realizada com sucesso!");
          saldo -= valorTransferido;
        } else if (chavePix.matches("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")) { // Verifica se é e-mail
          System.out.print("Digite o valor a ser transferido: ");
          double valorTransferido = scanner.nextDouble();
          scanner.nextLine(); // Consumindo a nova linha deixada pelo nextDouble()
          System.out.println("Digite a senha para efetivar a transferência: ");
          senhaDigitada = scanner.nextLine();
          if (!senhaDigitada.equals(senha)) {
            System.out.println("Senha incorreta. Operação de Pix cancelada.");
            return saldo;
          }
          System.out.println("Transferência via Chave Pix (e-mail) realizada com sucesso!");
          saldo -= valorTransferido;
        } else if (chavePix.matches("\\d{11}")) { // Verifica se é número de celular
          System.out.print("Digite o valor a ser transferido: ");
          double valorTransferido = scanner.nextDouble();
          scanner.nextLine(); // Consumindo a nova linha deixada pelo nextDouble()
          System.out.println("Digite a senha para efetivar a transferência: ");
          senhaDigitada = scanner.nextLine();
          if (!senhaDigitada.equals(senha)) {
            System.out.println("Senha incorreta. Operação de Pix cancelada.");
            return saldo;
          }
          System.out.println("Transferência via Chave Pix (número de celular) realizada com sucesso!");
          saldo -= valorTransferido;
        } else {
          System.out.println("Chave Pix inválida. Operação de Pix cancelada.");
        }
        break;
      case 3:
        System.out.println("Digite o código do Pix (copia e cola): ");
        String codigoPix = scanner.nextLine();
        System.out.print("Digite o valor a ser transferido: ");
        double valorTransferido = scanner.nextDouble();
        scanner.nextLine();

        // Solicitação da senha para prosseguir com o Pix
        System.out.print("Digite a senha para prosseguir com o Pix: ");
        senhaDigitada = scanner.nextLine();
        if (!senhaDigitada.equals(senha)) {
          System.out.println("Senha incorreta. Operação de Pix cancelada.");
          return saldo;
        }

        System.out.println("Transferência via copia e cola realizada com sucesso!");
        saldo -= gerarValorAleatorio();
        break;
      default:
        System.out.println("Opção inválida. Nenhuma transferência realizada.");
    }

    return saldo;
  }

  private static double menuOutros(double saldo, Scanner scanner, File arquivoSenha, String senha) {
    while (true) {
      System.out.println("\nMenu outros:");
      System.out.println("1: Transferência");
      System.out.println("2: Empréstimo");
      System.out.println("3: Atualizar Itoken");
      System.out.println("4: Atualizar o App");
      System.out.println("5: Mudar senha");
      System.out.println("0: Voltar ao menu principal");
      System.out.print("\nEscolha uma opção:\n");

      int subOpcao = scanner.nextInt();
      scanner.nextLine(); // Consumindo a nova linha deixada pelo nextInt()

      switch (subOpcao) {
        case 1:
          boolean dadosConfirmados = false;
          while (!dadosConfirmados) {
            System.out.print("Digite o número da agência: ");
            String numeroDaAgencia = scanner.nextLine();
            System.out.print("Digite o número da conta sem o dígito: ");
            String numeroDaConta = scanner.nextLine();
            System.out.print("Digite o dígito: ");
            String digito = scanner.nextLine();
            System.out.print("Digite o valor a ser transferido: ");

            double valorTransferido = scanner.nextDouble();
            scanner.nextLine(); // Consumindo a nova linha deixada pelo nextDouble()

            // "Limpar" a tela
            for (int i = 0; i < 2; i++) {
              System.out.println();
            }

            System.out.println("Confirme os dados da transferência:");
            System.out.println("\nAgência: " + numeroDaAgencia);
            System.out.println("Conta: " + numeroDaConta + "-" + digito);
            System.out.printf("Valor: R$ %.2f\n", valorTransferido);
            System.out.println("\n1: Confirmar");
            System.out.println("2: Corrigir dados");
            System.out.print("\nEscolha uma opção: ");

            int confirmacao = scanner.nextInt();
            scanner.nextLine(); // Consumindo a nova linha deixada pelo nextInt()

            if (confirmacao == 1) {
              System.out.print("Digite a senha para confirmar a transferência: ");
              String senhaDigitada = scanner.nextLine();

              contagemRegressiva(3);

              if (senhaDigitada.equals(senha)) {
                if (valorTransferido <= saldo) {
                  saldo -= valorTransferido;
                  System.out.println("Valor transferido com sucesso!");
                  System.out.println("Agência: " + numeroDaAgencia);
                  System.out.println("Conta: " + numeroDaConta + "-" + digito);
                  salvarSaldo(saldo);
                } else {
                  System.out.println("Saldo insuficiente para realizar a transferência.");
                }
                dadosConfirmados = true;
              } else {
                System.out.println("Senha incorreta. Por favor, tente novamente.\n");
              }
            } else if (confirmacao == 2) {
              System.out.println("Corrigindo dados. Vamos tentar novamente.");
            } else {
              System.out.println("Opção inválida. Tente novamente.");
            }
          }
          break;

        case 2:
          System.out.println("\nNo momento não temos aprovação de crédito em seu nome.");
          break;

        case 3:
          boolean senhaCorreta = false;

          while (!senhaCorreta) {
            System.out.print("\nDigite a senha para confirmar a atualização do Itoken: \n");
            String senhaDigitada = scanner.nextLine();

            if (senhaDigitada.equals(senha)) {
              System.out.println("\nItoken atualizado com sucesso!\n");
              contagemRegressiva(3);
              senhaCorreta = true;
            } else {
              System.err.println("\nSenha incorreta. Por favor, tente novamente.\n");
              break;
            }
          }
          break;

        case 4:
          senhaCorreta = false;

          while (!senhaCorreta) {
            System.out.print("\nDigite a senha para confirmar a atualização do aplicativo: \n");
            String senhaDigitada = scanner.nextLine();

            // Verifica se a senha digitada está correta
            if (senhaDigitada.equals(senha)) {
              System.out.println("\nAtualizando o aplicativo...\n");
              contagemRegressiva(3);
              System.out.println("\nAplicativo atualizado com sucesso!\n");
              senhaCorreta = true;
            } else {
              System.out.println("\nSenha incorreta. Por favor, tente novamente.\n");
              break;
            }
          }
          break;

        case 5:
          boolean trocarSenhaConfirmados = false;
          while (!trocarSenhaConfirmados) {
            System.out.println("Deseja mudar a senha mesmo?");
            System.out.println("\n1: Confirmar");
            System.out.println("2: Não desejo");
            System.out.print("\nEscolha uma opção: \n");

            int confirmacao = scanner.nextInt();
            scanner.nextLine(); // Consumindo a nova linha deixada pelo nextInt()

            if (confirmacao == 1) {
              System.out.println("Digite a nova senha com 4 dígitos:");
              String novaSenha = scanner.nextLine();

              if (novaSenha.length() == 4 && novaSenha.matches("\\d{4}")) {
                contagemRegressiva(3);
                senha = novaSenha; // Atualizar a senha global
                System.out.println("\nSenha alterada com sucesso!");
                salvarSenha(arquivoSenha, senha); // Salvar a nova senha no arquivo
                trocarSenhaConfirmados = true;
              } else {
                System.out.println("Senha inválida. A senha deve ter exatamente 4 dígitos numéricos.");
              }
            } else if (confirmacao == 2) {
              System.out.println("Vamos tentar novamente..?");
              trocarSenhaConfirmados = true; // Sai do loop sem alterar a senha
            } else {
              System.out.println("Opção inválida. Tente novamente.");
            }
          }
          break;

        case 0:
          System.out.println("\nVoltando ao menu principal.");
          return saldo;

        default:
          System.out.println("Opção inválida. Tente novamente.");
          break;
      }
    }
  }

  private static void atualizarApp(Scanner scanner) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'atualizarApp'");
  }

  private static void encerrarPrograma(double saldo) {
    System.out.printf("Saldo final: R$ %.2f\n", saldo);
    System.out.println("\nVolte sempre ao Banco Mrc81!");
  }

  private static void salvarSaldo(double saldo) {
    // Código para salvar o saldo em um arquivo ou banco de dados, se necessário
  }

  private static void salvarSenha(File arquivo, String senha) {
    try (FileWriter writer = new FileWriter(arquivo)) {
      writer.write(senha);
      System.out.println("Senha salva com sucesso.");
    } catch (IOException e) {
      System.out.println("Erro ao salvar a senha: " + e.getMessage());
    }
  }

  private static String gerarCodigoDeBarras() {
    SecureRandom random = new SecureRandom();
    StringBuilder codigo = new StringBuilder();
    for (int i = 0; i < 48; i++) {
      int digit = random.nextInt(10);
      codigo.append(digit);
    }
    return codigo.toString();
  }
}
