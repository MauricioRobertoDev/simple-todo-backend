import { IController } from "@/interfaces";
import { TodoMapper } from "@/mappers/todo.mapper";
import { PrismaTodoRepository } from "@/repositories/prisma/prisma-todo.repository";
import { UpdateStatusTodoService } from "@/services/update-todo-status.service";
import { HttpStatus } from "@/util/http-status";
import { Message } from "@/util/messages";
import { Request, Response } from "express";

export class UpdateStatusTodoController implements IController {
  async handle(req: Request, res: Response): Promise<Response> {
    const todoRepository = new PrismaTodoRepository();
    const updateStatusService = new UpdateStatusTodoService(todoRepository);

    const todoOrErrors = await updateStatusService.execute({
      id: req.params.id,
    });

    if (todoOrErrors.isLeft()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: Message.VALIDATION_ERRORS,
        errors: todoOrErrors.getValue().getErrorData(),
      });
    }

    const todoData = TodoMapper.toDTO(todoOrErrors.getValue());

    return res.status(HttpStatus.OK).json({
      message: Message.UPDATED_TODO,
      data: todoData,
    });
  }
}
