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

module.exports = {
  gerarCodigoDeBarras,
  extrairUltimosTresDigitos,
};
