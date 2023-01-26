import { Todo } from "@/entities";
import { DatabaseError } from "@/errors/database.error";
import { Either, left, right } from "@/errors/either";
import { IService } from "@/interfaces";
import { TodoRepository } from "@/repositories/interfaces";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";
import { EditTodoService } from "./edit-todo.service";

export type UpdateStatusInput = {
  id: string;
};

export class UpdateStatusTodoService
  implements IService<UpdateStatusInput, Todo>
{
  constructor(private todoRepository: TodoRepository) {}

  async execute({ id }: UpdateStatusInput): Promise<Either<ErrorBundle, Todo>> {
    try {
      const oldTodo = await this.todoRepository.findById(id);
      const editTodoService = new EditTodoService(this.todoRepository);
      const startAt = oldTodo?.startAt ?? new Date();
      const endAt = oldTodo?.startAt ? oldTodo?.endAt ?? new Date() : undefined;

      const todoOrErrors = await editTodoService.execute({
        id,
        startAt,
        endAt,
      });

      if (todoOrErrors.isLeft()) return left(todoOrErrors.getValue());
      return right(todoOrErrors.getValue());
    } catch (error) {
      throw new DatabaseError(Message.DB_ERROR_UPDATING_TODO);
    }
  }
}
