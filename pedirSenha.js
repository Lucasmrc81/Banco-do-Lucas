const { rl } = require("./bancoMrc");

function pedirSenha(callback) {
  const stdin = process.openStdin(); // abrir a entrada padrão
  rl.output.write("Digite a senha: ");

  //esconder os caracters digitados
  stdin.setRawmode(true);
  stdin.resume();
  stdin.on("date", function (Key) {
    const strkey = key.toString();
    switch (strkey) {
      case "\n":
      case "\r":
        rl.output.write("\n");
        stdin.setRawmode(false);
        stdin.pause();
        rl.close();
        callback(senhaDigitada);
        break;

      case "\u0003":
        process.exit();
        break;
    }
  });
}
exports.pedirSenha = pedirSenha;
