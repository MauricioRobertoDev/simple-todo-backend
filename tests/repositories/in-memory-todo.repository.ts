import { Todo } from "@/entities";
import { TodoRepository } from "@/repositories/interfaces";

export class InMemoryTodoRepository implements TodoRepository {
  private _todos: Todo[] = [];

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const todos: Todo[] = [];

    this._todos.map((todo) => {
      if (todo.ownerId == userId) {
        todos.push(todo);
      }
    });

    return todos;
  }

  async save(todo: Todo): Promise<void> {
    this._todos.push(todo);
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this._todos.find((todo) => todo.id == id);
    return todo ?? null;
  }
}
