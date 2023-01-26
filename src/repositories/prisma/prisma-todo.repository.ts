import { Todo } from "@/entities";
import prisma from "@/database/prisma.client";
import { TodoRepository } from "../interfaces";

export class PrismaTodoRepository implements TodoRepository {
  async delete(todo: Todo): Promise<void> {
    await prisma.todoModel.delete({
      where: { id: todo.id },
    });
  }
  async findAllByUserId(userId: string): Promise<Todo[]> {
    const todoModels = await prisma.todoModel.findMany({
      where: { ownerId: userId },
    });

    const todos: Todo[] = [];

    if (todoModels.length > 0) {
      todoModels.forEach((todoModel) => {
        todos.push(
          Todo.create(
            {
              description: todoModel.description,
              createdAt: todoModel.createdAt,
              ownerId: todoModel.ownerId,
              startAt: todoModel.startAt ?? undefined,
              endAt: todoModel.endAt ?? undefined,
            },
            todoModel.id
          ).getValue() as Todo
        );
      });
    }

    return todos;
  }

  async findById(id: string): Promise<Todo | null> {
    const todoModel = await prisma.todoModel.findFirst({ where: { id } });

    if (todoModel) {
      const user = Todo.create(
        {
          description: todoModel.description,
          createdAt: todoModel.createdAt,
          ownerId: todoModel.ownerId,
          startAt: todoModel.startAt ?? undefined,
          endAt: todoModel.endAt ?? undefined,
        },
        todoModel.id
      );

      if (user.isLeft()) return null;

      return user.getValue();
    }

    return null;
  }

  async save(todo: Todo): Promise<void> {
    await prisma.todoModel.upsert({
      where: { id: todo.id },
      update: {
        description: todo.description.getValue(),
        createdAt: todo.createdAt,
        ownerId: todo.ownerId,
        startAt: todo.startAt,
        endAt: todo.endAt,
      },
      create: {
        description: todo.description.getValue(),
        createdAt: todo.createdAt,
        ownerId: todo.ownerId,
        startAt: todo.startAt,
        endAt: todo.endAt,
        id: todo.id,
      },
    });
  }
}
