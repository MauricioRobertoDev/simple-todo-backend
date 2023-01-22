import { Todo } from "@/entities";

export type TodoData = {
  id: string;
  description: string;
  ownerId: string | undefined;
  createdAt: Date | undefined;
  startAt: Date | undefined;
  endAt: Date | undefined;
};

export class TodoMapper {
  static toDTO(todo: Todo): TodoData {
    return {
      id: todo.id,
      description: todo.description.getValue(),
      ownerId: todo.ownerId,
      createdAt: todo.createdAt,
      startAt: todo.startAt,
      endAt: todo.endAt,
    };
  }
}
