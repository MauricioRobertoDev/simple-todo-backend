import { Todo } from "@/entities";
import { DatabaseError } from "@/errors/database.error";
import { Either, left, right } from "@/errors/either";
import { IService } from "@/interfaces";
import { TodoRepository } from "@/repositories/interfaces";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";

export type CreateTodoInput = {
  description: string;
  createdAt: Date;
  ownerId: string;
  startAt?: Date;
  endAt?: Date;
};

export class CreateTodoService implements IService<CreateTodoInput, Todo> {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    description,
    createdAt,
    ownerId,
    startAt,
    endAt,
  }: CreateTodoInput): Promise<Either<ErrorBundle, Todo>> {
    const todoOrError = Todo.create({
      description,
      createdAt,
      ownerId,
      startAt,
      endAt,
    });

    if (todoOrError.isLeft()) return left(todoOrError.getValue());

    try {
      await this.todoRepository.save(todoOrError.getValue());
      return right(todoOrError.getValue());
    } catch (error) {
      throw new DatabaseError(Message.DB_ERROR_CREATING_TODO);
    }
  }
}
