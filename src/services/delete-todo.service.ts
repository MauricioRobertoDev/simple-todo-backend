import { AppError } from "@/errors/app.error";
import { DatabaseError } from "@/errors/database.error";
import { Either, left, right } from "@/errors/either";
import { IService } from "@/interfaces";
import { TodoRepository } from "@/repositories/interfaces";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";

export type DeleteTodoInput = {
  id: string;
  requester?: string;
};

export class EditTodoService implements IService<DeleteTodoInput, void> {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    id,
    requester,
  }: DeleteTodoInput): Promise<Either<ErrorBundle, undefined>> {
    const bundle = ErrorBundle.create();
    const todo = await this.todoRepository.findById(id);

    if (!todo || (requester && requester != todo.ownerId)) {
      bundle.add(new AppError("id", Message.TODO_NOT_FOUND));
      return left(bundle);
    }

    try {
      await this.todoRepository.delete(todo);
      return right(undefined);
    } catch (error) {
      throw new DatabaseError(Message.DB_ERROR_UPDATING_TODO);
    }
  }
}
