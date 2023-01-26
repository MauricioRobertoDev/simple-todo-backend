import { IController } from "@/interfaces";
import { TodoData, TodoMapper } from "@/mappers/todo.mapper";
import { PrismaTodoRepository } from "@/repositories/prisma/prisma-todo.repository";
import { CreateTodoService } from "@/services";
import { HttpStatus } from "@/util/http-status";
import { Message } from "@/util/messages";
import { Request, Response } from "express";

export class CreateTodoController implements IController {
  async handle(req: Request, res: Response): Promise<Response> {
    const todoRepository = new PrismaTodoRepository();
    const createTodoService = new CreateTodoService(todoRepository);

    const todoOrErrors = await createTodoService.execute({
      description: req.body.description,
      ownerId: req.userId as string,
    });

    if (todoOrErrors.isLeft()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: Message.VALIDATION_ERRORS,
        errors: todoOrErrors.getValue().getErrorData(),
      });
    }

    const todoData: Partial<TodoData> = TodoMapper.toDTO(
      todoOrErrors.getValue()
    );

    delete todoData.ownerId;

    return res.status(HttpStatus.CREATED).json({
      message: Message.CREATED_TODO,
      data: todoData,
    });
  }
}
