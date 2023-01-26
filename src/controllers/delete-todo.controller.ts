import { IController } from "@/interfaces";
import { PrismaTodoRepository } from "@/repositories/prisma/prisma-todo.repository";
import { DeleteTodoService } from "@/services";
import { HttpStatus } from "@/util/http-status";
import { Message } from "@/util/messages";
import { Request, Response } from "express";

export class DeleteTodoController implements IController {
  async handle(req: Request, res: Response): Promise<Response> {
    const todoRepository = new PrismaTodoRepository();
    const editTodoService = new DeleteTodoService(todoRepository);

    const voidOrErrors = await editTodoService.execute({
      id: req.params.id,
      requester: req.userId,
    });

    if (voidOrErrors.isLeft()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: Message.VALIDATION_ERRORS,
        errors: voidOrErrors.getValue().getErrorData(),
      });
    }

    return res.status(HttpStatus.OK).json({
      message: Message.DELETED_TODO,
    });
  }
}
