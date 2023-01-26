import { describe, expect, test, vi } from "vitest";
import { EditTodoService } from "@/services";
import { ErrorBundle } from "@/shared/error-bundle";
import { Todo } from "@/entities";
import { Message } from "@/util/messages";
import { DatabaseError } from "@/errors/database.error";
import { InMemoryTodoRepository } from "../repositories/in-memory-todo.repository";
import crypto from "node:crypto";

describe("EditTodoService", () => {
  test("Deve editar uma todo e retorna-lá", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const editTodoService = new EditTodoService(todoRepository);

    const ownerId = crypto.randomUUID();

    const todo = Todo.create({
      description: "valid_description",
      ownerId: ownerId,
      createdAt: new Date(Date.now()),
    });

    await todoRepository.save(todo.getValue() as Todo);

    let result = (
      await editTodoService.execute({
        id: (todo.getValue() as Todo).id,
        description: "another_valid_description",
        startAt: new Date(Date.now()),
        endAt: new Date(Date.now()),
      })
    ).getValue();

    expect(result).toBeInstanceOf(Todo);
    result = result as Todo;
    expect(result.description.getValue()).toBe("another_valid_description");
    expect(result.createdAt).toBeDefined();
    expect(result.startAt).toBeDefined();
    expect(result.endAt).toBeDefined();

    let updatedTodo = await todoRepository.findById(result.id);
    expect(updatedTodo?.description.getValue()).toBe(
      "another_valid_description"
    );
    expect(updatedTodo?.createdAt).toBeDefined();
    expect(updatedTodo?.startAt).toBeDefined();
    expect(updatedTodo?.endAt).toBeDefined();

    result = (
      await editTodoService.execute({
        id: (todo.getValue() as Todo).id,
        description: "another_valid_description_2",
        requester: ownerId,
      })
    ).getValue();

    expect(result).toBeInstanceOf(Todo);
    result = result as Todo;
    expect(result.description.getValue()).toBe("another_valid_description_2");
    updatedTodo = await todoRepository.findById(result.id);
    expect(updatedTodo?.description.getValue()).toBe(
      "another_valid_description_2"
    );

    result = (
      await editTodoService.execute({
        id: (todo.getValue() as Todo).id,
        description: "another_valid_description_3",
        requester: "any_another_user_id",
      })
    ).getValue();

    expect(result).toBeInstanceOf(ErrorBundle);
    result = result as ErrorBundle;
    expect(result.getErrors()[0].message).toBe(Message.TODO_NOT_FOUND);
    updatedTodo = await todoRepository.findById((todo.getValue() as Todo).id);
    expect(updatedTodo?.description.getValue()).toBe(
      "another_valid_description_2"
    );
  });

  test("Deve retornar um ErrorBundle caso tenha qualquer erro na atualização", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const editTodoService = new EditTodoService(todoRepository);

    const todo = Todo.create({
      description: "valid_description",
      ownerId: crypto.randomUUID(),
    });

    await todoRepository.save(todo.getValue() as Todo);

    const result = await editTodoService.execute({
      id: (todo.getValue() as Todo).id,
      description: `valid_description_but_to_long_${"a".repeat(255)}`,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.getValue()).toBeInstanceOf(ErrorBundle);

    const result2 = await editTodoService.execute({
      id: "invalid_id",
      description: "valid_description",
    });

    expect(result2.isLeft()).toBeTruthy();
    expect(result2.getValue()).toBeInstanceOf(ErrorBundle);
  });

  test("Deve estourar um DatabaseError o banco de dados falhe", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const editTodoService = new EditTodoService(todoRepository);

    const todo = Todo.create({
      description: "valid_description",
      ownerId: crypto.randomUUID(),
    });

    await todoRepository.save(todo.getValue() as Todo);

    vi.spyOn(todoRepository, "save").mockRejectedValue("");

    const result = editTodoService.execute({
      id: (todo.getValue() as Todo).id,
      description: `valid_description`,
    });

    expect(result).rejects.toThrow(
      new DatabaseError(Message.DB_ERROR_UPDATING_TODO)
    );
  });
});
