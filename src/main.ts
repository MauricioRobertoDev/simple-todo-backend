import prisma from "@/database/prisma.client";
import { app } from "./server";

async function setupEnv() {
  console.log("🚀 Checando as váriaveis do sistema...");

  const notDefined = [];
  const need = ["SERVER_PORT", "APP_SECRET", "DATABASE_URL"];

  need.forEach((name) => {
    if (!process.env[name]) notDefined.push(name);
  });

  if (notDefined.length > 0) {
    console.log(
      `🛑 A aplicação não pode ser executada sem ter as váriaveis ${need.join(
        ", "
      )}...`
    );
    process.exit(1);
  }

  console.log("✅ Todas as váriaveis necessárias estão definidas...");
}

async function setupDatabase() {
  console.log("🚀 Testando conexão com banco de dados...");

  try {
    await prisma.$connect();
    await prisma.$disconnect();
    console.log("✅ O banco de dados está ativo e funcional...");
  } catch (error) {
    console.log("🛑 Não foi possível se conectar com banco de dados...");
    await prisma.$disconnect();
    console.log(error);
  }
}

async function setupExpress() {
  console.log("🚀 Iniciando o servidor express...");

  const port = Number(process.env.SERVER_PORT);

  app.listen(port, () => {
    console.log(`🔥 Servidor rodando na porta ${port}...`);
  });
}

console.log("🚀 Iniciando a aplicação...");
setupEnv().then(() => setupDatabase().then(() => setupExpress()));
