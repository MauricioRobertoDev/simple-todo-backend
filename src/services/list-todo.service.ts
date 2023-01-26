import { Todo } from "@/entities";
import { DatabaseError } from "@/errors/database.error";
import { Either, right } from "@/errors/either";
import { IService } from "@/interfaces";
import { TodoRepository } from "@/repositories/interfaces";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";

export type ListTodoInput = {
  userId: string;
};

export class ListTodoService implements IService<ListTodoInput, Todo[]> {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    userId,
  }: ListTodoInput): Promise<Either<ErrorBundle, Todo[]>> {
    try {
      const todos = await this.todoRepository.findAllByUserId(userId);
      return right(todos);
    } catch (error) {
      throw new DatabaseError(Message.DB_ERROR_LISTING_TODO);
    }
  }
}
