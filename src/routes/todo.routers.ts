import { CreateTodoController } from "@/controllers/create-todo.controller";
import { auth } from "@/middlewares/auth.middleware";
import { Router } from "express";

const todoRouter = Router();

todoRouter.post("/nova-todo", auth, new CreateTodoController().handle);

export default todoRouter;
