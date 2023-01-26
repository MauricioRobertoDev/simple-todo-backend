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

    const todo = Todo.create({
      description: "valid_description",
      ownerId: crypto.randomUUID(),
    });

    await todoRepository.save(todo.getValue() as Todo);

    const result = await editTodoService.execute({
      id: (todo.getValue() as Todo).id,
      description: "another_valid_description",
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toBeInstanceOf(Todo);
    expect((result.getValue() as Todo).description).toBe(
      "another_valid_description"
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

    const result = await editTodoService.execute({
      id: (todo.getValue() as Todo).id,
      description: `valid_description`,
    });

    expect(result).rejects.toThrow(
      new DatabaseError(Message.DB_ERROR_CREATING_TODO)
    );
  });
});
