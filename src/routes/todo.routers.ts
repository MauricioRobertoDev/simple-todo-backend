import { CreateTodoController } from "@/controllers/create-todo.controller";
import { EditTodoController } from "@/controllers/edit-todo.controller";
import { auth } from "@/middlewares/auth.middleware";
import { Router } from "express";

const todoRouter = Router();

todoRouter.post("/nova-todo", auth, new CreateTodoController().handle);
todoRouter.post("/editar-todo/:id", auth, new EditTodoController().handle);

export default todoRouter;
