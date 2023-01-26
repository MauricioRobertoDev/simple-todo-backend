import { Todo } from "@/entities";
import { TodoRepository } from "@/repositories/interfaces";

export class InMemoryTodoRepository implements TodoRepository {
  async delete(todo: Todo): Promise<void> {
    const index = this._todos.findIndex((item) => item.id == todo.id);
    this._todos.splice(index, 1);
  }
  public _todos: Todo[] = [];

  async findAllByUserId(userId: string): Promise<Todo[]> {
    return this._todos.filter((todo) => todo.ownerId == userId);
  }

  async save(todo: Todo): Promise<void> {
    await this.delete(todo);
    this._todos.push(todo);
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this._todos.find((todo) => todo.id == id);
    return todo ?? null;
  }
}
