import { IController } from "@/interfaces";
import { TodoMapper } from "@/mappers/todo.mapper";
import { PrismaTodoRepository } from "@/repositories/prisma/prisma-todo.repository";
import { EditTodoService } from "@/services/edit-todo.service";
import { HttpStatus } from "@/util/http-status";
import { Message } from "@/util/messages";
import { Request, Response } from "express";

export class EditTodoController implements IController {
  async handle(req: Request, res: Response): Promise<Response> {
    const todoRepository = new PrismaTodoRepository();
    const editTodoService = new EditTodoService(todoRepository);

    const todoOrErrors = await editTodoService.execute({
      id: req.params.id,
      description: req.body.description,
      startAt: req.body.start_at,
      endAt: req.body.end_at,
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
