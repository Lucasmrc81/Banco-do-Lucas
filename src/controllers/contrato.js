function gerarContrato(
  valorEmprestimo,
  cpf,
  prazoEmprestimo,
  taxaJuros,
  tipoEmprestimo,
  garantia,
  valorParcela,
  diaVencimento
) {
  const contrato = `
    Proposta de Empréstimo

    Prezado(a) Cliente, do CPF ${cpf}

    Segue abaixo a proposta detalhada para o empréstimo solicitado:

    Proposta de Empréstimo:
    - Valor do Empréstimo: R$ ${valorEmprestimo.toFixed(2)}
    - Prazo: ${prazoEmprestimo} meses
    - Taxa de Juros: ${(taxaJuros * 100).toFixed(2)}% ao mês
    - Tipo de Empréstimo: ${tipoEmprestimo}

    Termos e Condições do Empréstimo:
    - Valor do Empréstimo: O valor solicitado pelo cliente é de R$ ${valorEmprestimo.toFixed(
      2
    )}, a ser concedido em uma única parcela.
    - Prazo: O prazo para a quitação do empréstimo é de ${prazoEmprestimo} meses.
    - Taxa de Juros: A taxa de juros aplicada ao empréstimo é de ${(
      taxaJuros * 100
    ).toFixed(2)}% ao mês.
    - Garantias: O tipo de garantia exigida para este empréstimo é ${garantia}.
    - Condições de Pagamento: O pagamento será realizado em ${prazoEmprestimo} parcelas mensais de R$ ${valorParcela.toFixed(
    2
  )}, com vencimento todo dia ${diaVencimento} de cada mês.

    Caso tenha alguma dúvida ou necessite de mais informações, estamos à disposição através do telefone +12 568418934 ou do e-mail bancomrc81@gmail.com.

    Atenciosamente,

    Lucas Marcio Pereira Da Silva
    CIO
    Banco Mrc81
    Av. Paulista, 1234, 10º andar
    Bela Vista, São Paulo - SP, 01310-100
    Telefone: +12 568418934
    E-mail: bancomrc81@gmail.com
  `;

  https: return contrato;
}

module.exports = gerarContrato;
