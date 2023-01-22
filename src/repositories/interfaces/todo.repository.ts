import { Todo } from "@/entities";

export interface TodoRepository {
  findById(id: string): Promise<Todo | null>;

  save(user: Todo): Promise<void>;

  findAllByUserId(userId: string): Promise<Todo[]>;
}
