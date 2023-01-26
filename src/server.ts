import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import authRouter from "@/routes/auth.routers";
import todoRouter from "@/routes/todo.routers";
import { Message } from "./util/messages";

const app = express();

app.use(express.json());

app.use(authRouter);
app.use(todoRouter);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    response.status(500).send(Message.SERVER_ERROR);
  }
);

export { app };
