import process from "process";
import express from "express";

export class Server {
  start() {
    console.log("🚀 Iniciando a aplicação...");
    this.setupDatabase();
    this.setupExpress();
  }

  setupExpress() {
    console.log("🚀 Iniciando o servidor express...");

    let port = Number(process.env.SERVER_PORT);

    if (!port) {
      port = 3000;
      console.log("❗Porta não encontrada usando por padrão...");
    }

    const app = express();

    app.use(express.json());

    app.listen(port, () =>
      console.log(`🔥 Servidor rodando na porta ${port}...`)
    );
  }

  setupDatabase() {
    console.log("🚀 Iniciando conexão com banco de dados...");
    console.log("🔥 Conexão com banco de dados estabelecida...");
  }
}
