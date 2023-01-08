import express from "express";
import process from "process";

const port = process.env.SERVER_PORT ?? 3000;

const app = express();

app.listen(port, () => console.log(`🔥 App rodando na porta ${port}...`));
