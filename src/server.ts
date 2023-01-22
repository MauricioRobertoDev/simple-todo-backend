import express from "express";
import authRouter from "@/routes/auth.routers";
import todoRouter from "@/routes/todo.routers";

const app = express();

app.use(express.json());

app.use(authRouter);
app.use(todoRouter);

export { app };
