import { CreateTodoController } from "@/controllers/create-todo.controller";
import { DeleteTodoController } from "@/controllers/delete-todo.controller";
import { EditTodoController } from "@/controllers/edit-todo.controller";
import { ListTodoController } from "@/controllers/list-todo.controller";
import { UpdateStatusTodoController } from "@/controllers/update-todo-status.controller";
import { auth } from "@/middlewares/auth.middleware";
import { Router } from "express";

const todoRouter = Router();

todoRouter.post("/nova-todo", auth, new CreateTodoController().handle);
todoRouter.post("/editar-todo/:id", auth, new EditTodoController().handle);
todoRouter.post(
  "/atualizar-status-todo/:id",
  auth,
  new UpdateStatusTodoController().handle
);
todoRouter.get("/listar-todos", auth, new ListTodoController().handle);
todoRouter.delete("/excluir-todo/:id", auth, new DeleteTodoController().handle);

export default todoRouter;
