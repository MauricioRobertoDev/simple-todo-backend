import { Todo } from "@/entities";
import { IController } from "@/interfaces";
import { TodoData, TodoMapper } from "@/mappers/todo.mapper";
import { PrismaTodoRepository } from "@/repositories/prisma/prisma-todo.repository";
import { ListTodoService } from "@/services";
import { HttpStatus } from "@/util/http-status";
import { Message } from "@/util/messages";
import { Request, Response } from "express";

export class ListTodoController implements IController {
  async handle(req: Request, res: Response): Promise<Response> {
    const todoRepository = new PrismaTodoRepository();
    const editTodoService = new ListTodoService(todoRepository);

    const todosOrErrors = await editTodoService.execute({
      userId: req.userId as string,
    });

    if (todosOrErrors.isLeft()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: Message.VALIDATION_ERRORS,
        errors: todosOrErrors.getValue().getErrorData(),
      });
    }

    const todosData: Partial<TodoData>[] = [];

    todosOrErrors.getValue().forEach((todo: Todo) => {
      const todoData: Partial<TodoData> = TodoMapper.toDTO(todo);
      delete todoData.ownerId;
      todosData.push(todoData);
    });

    return res.status(HttpStatus.OK).json({
      message: Message.LISTED_TODOS,
      data: todosData,
    });
  }
}
