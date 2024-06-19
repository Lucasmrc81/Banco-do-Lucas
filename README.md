# Mrc81 Bank

## Descrição do Projeto

O projeto "Mrc81 Bank" é um aplicativo bancário simulado que permite aos usuários realizar várias operações financeiras, como depósitos, saques, pagamentos de contas, transferências via Pix e gerenciamento de empréstimos. Ele é implementado em Node.js e simula um aplicativo de celular onde os usuários podem interagir através de um menu de opções no terminal.

## Funcionalidades

- **Depósito**: Permite ao usuário depositar um valor na conta.
- **Saque**: Permite ao usuário sacar um valor da conta.
- **Pagamento de Conta**: Permite ao usuário pagar contas via código de barras.
- **Transferência via Pix**: Permite ao usuário realizar transferências utilizando QR code, chave Pix ou código de "copia e cola".
- **Empréstimos**: Oferece diferentes opções de empréstimos como Pessoal, Consignado, Imobiliário e FGTS.

## Tecnologias Utilizadas

- **Node.js**: Plataforma utilizada para execução do código JavaScript no servidor.
- **Readline**: Módulo do Node.js utilizado para ler dados de entrada do usuário via terminal.
- **Módulos personalizados**: `enviarEmail`, `contrato`, `emprestimoImobiliario`, `emprestimoPessoal`, `emprestimoFGTS`, `emprestimoConsignado`.

## Como Iniciar o Projeto

### Pré-requisitos

- Node.js instalado

### Passos para iniciar

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/seuusuario/banco-mrc81.git
    cd banco-mrc81
    ```

2. **Instale as dependências** (se houver):
    ```bash
    npm install
    ```

3. **Execute o programa**:
    ```bash
    node index.js
    ```

### Usando o Projeto

- **Inicie o programa**: Ao iniciar o programa, uma mensagem de boas-vindas será exibida e o usuário será solicitado a inserir a senha.
- **Navegue pelo menu**: Após inserir a senha correta, o usuário poderá escolher entre as opções disponíveis no menu para realizar diferentes operações bancárias.
- **Deposite ou saque dinheiro**: Siga as instruções na tela para depositar ou sacar valores da conta.
- **Pague contas**: Digite o valor e o código de barras para realizar pagamentos.
- **Realize transferências via Pix**: Escolha entre QR code, chave Pix ou "copia e cola" para realizar transferências.
- **Gerencie empréstimos**: Navegue pelas opções de empréstimos para escolher o tipo de empréstimo desejado.

## Obter Ajuda

Os usuários podem obter ajuda com o projeto das seguintes maneiras:

- **Documentação do Código**: Consulte a documentação do código, se disponível, para entender a estrutura e o funcionamento das diferentes partes do sistema.
- **Comunidade de Desenvolvedores**: Participe de fóruns de desenvolvedores como Stack Overflow, GitHub, ou comunidades de Node.js para discutir dúvidas e problemas específicos.
- **Tutoriais e Exemplos**: Procure tutoriais e exemplos de sistemas bancários em Node.js online, que podem fornecer insights adicionais e soluções para problemas comuns.

## Contribuições

Este projeto é mantido e desenvolvido por Lucas Mrc81. As contribuições são bem-vindas de diversos colaboradores que desejam aprimorar o sistema ou adaptá-lo para suas necessidades. Se você deseja contribuir, siga as diretrizes de contribuição, faça um fork do repositório e envie suas melhorias via pull requests.

---
