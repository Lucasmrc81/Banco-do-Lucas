function gerarMensagemBoasVindas(nomeCliente, agencia, conta) {
  const mensagem = `
  **Bem-vindo ao Mrc81 Bank, ${nomeCliente}!**
  
  Estamos muito felizes em tê-lo conosco. Abaixo, você encontrará suas informações bancárias essenciais:
  
  **Número da Agência:** ${agencia}
  **Número da Conta:** ${conta}
  
  **Nome:** ${nomeCliente}
  
  **Informações Importantes:**
  
  1. **Acesso ao Internet Banking:**
  - Para acessar sua conta online, utilize nosso aplicativo disponível na App Store e Google Play. Seu login inicial é o seu CPF cadastrado.
  
  2. **Aplicativo Mobile:**
  - Baixe nosso aplicativo, disponível na App Store e Google Play, para gerenciar suas finanças de forma rápida e segura.
  
  3. **Atendimento ao Cliente:**
  - Nosso atendimento está disponível 24/7 para ajudá-lo com qualquer dúvida ou serviço. Ligue para 0800-123-456 ou envie um e-mail para suporte@mrc81bank.com.
  
  4. **Segurança:**
  - Nunca compartilhe sua senha ou dados pessoais. O Mrc81 Bank nunca solicitará sua senha por e-mail ou telefone.
  
  5. **Ofertas Especiais:**
  - Aproveite nossas taxas especiais de empréstimos e financiamentos. Consulte nossos gerentes para mais informações.
  
  Estamos comprometidos em oferecer um serviço de excelência e estamos à disposição para ajudar no que for necessário. Sinta-se à vontade para nos contactar a qualquer momento.
  
  **Obrigado por escolher o Mrc81 Bank. Juntos, construiremos um futuro financeiro sólido e próspero!**
  
  ---
  
  **Importante:** O Mrc81 Bank é um simulador de banco. As transações e serviços realizados são exclusivamente para fins educativos e de simulação. Nenhuma operação financeira real é realizada.
  
  Atenciosamente,
  
  **Equipe Mrc81 Bank**
   
    Lucas Marcio Pereira Da Silva
    CIO
    Banco Mrc81
    Av. Paulista, 1234, 10º andar
    Bela Vista, São Paulo - SP, 01310-100
    Telefone: +12 568418934
    E-mail: bancomrc81@gmail.com `;

  return mensagem;
}

module.exports = { gerarMensagemBoasVindas };
