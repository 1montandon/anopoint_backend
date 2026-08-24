import bcrypt from "bcrypt";

async function gerarHash() {
  const password = "senha123"; // Altere para a senha que quer testar

  // O seu código:
  const hashedPassword = await bcrypt.hash(password, 13);

  console.log("\nSeu hash gerado:\n");
  console.log(hashedPassword);
}

gerarHash();
