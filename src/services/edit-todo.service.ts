import { Todo } from "@/entities";
import { AppError } from "@/errors/app.error";
import { DatabaseError } from "@/errors/database.error";
import { Either, left, right } from "@/errors/either";
import { IService } from "@/interfaces";
import { TodoRepository } from "@/repositories/interfaces";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";

export type EditTodoInput = {
  id: string;
  description?: string;
  startAt?: Date;
  endAt?: Date;
};

export class EditTodoService implements IService<EditTodoInput, Todo> {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    id,
    description,
    startAt,
    endAt,
  }: EditTodoInput): Promise<Either<ErrorBundle, Todo>> {
    const bundle = ErrorBundle.create();
    const oldTodo = await this.todoRepository.findById(id);

    if (!oldTodo) {
      bundle.add(new AppError("id", Message.TODO_NOT_FOUND));
      return left(bundle);
    }

    const newTodoOrError = Todo.create(
      {
        description: description ?? oldTodo.description.getValue(),
        ownerId: oldTodo.ownerId,
        startAt: startAt ?? oldTodo.startAt,
        endAt: endAt ?? oldTodo.endAt,
        createdAt: oldTodo.createdAt,
      },
      id
    );

    if (newTodoOrError.isLeft()) return left(newTodoOrError.getValue());

    try {
      await this.todoRepository.save(newTodoOrError.getValue());
      return right(newTodoOrError.getValue());
    } catch (error) {
      throw new DatabaseError(Message.DB_ERROR_CREATING_TODO);
    }
  }
}
