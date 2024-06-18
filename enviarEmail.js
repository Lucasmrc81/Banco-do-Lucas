const nodemailer = require("nodemailer");

async function enviarEmail(destinatario, assunto, mensagem) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lucasmrc81@gmail.com", // Seu email
      pass: "syvs khvo zsyq nqxb", // Sua senha
    },
  });

  let mailOptions = {
    from: `"Banco Mrc81" <lucasmrc81@gmail.com>`,
    to: destinatario,
    subject: assunto,
    text: mensagem,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
  }
}

module.exports = enviarEmail;
