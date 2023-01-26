import { describe, expect, test, vi } from "vitest";
import { CreateTodoService } from "@/services";
import { ErrorBundle } from "@/shared/error-bundle";
import { Todo } from "@/entities";

import { Message } from "@/util/messages";
import { DatabaseError } from "@/errors/database.error";
import { InMemoryTodoRepository } from "../repositories/in-memory-todo.repository";
import crypto from "node:crypto";

describe("CreateTodoService", () => {
  test("Deve retornar uma Todo", async () => {
    const userRepository = new InMemoryTodoRepository();
    const createTodoService = new CreateTodoService(userRepository);

    let result = (
      await createTodoService.execute({
        description: "valid_description",
        ownerId: crypto.randomUUID(),
      })
    ).getValue();

    expect(result).toBeInstanceOf(Todo);
    result = result as Todo;
    expect(result.createdAt).toBeDefined();
  });

  test("Deve retornar um ErrorBundle caso tenha qualquer erro na criação", async () => {
    const userRepository = new InMemoryTodoRepository();
    const createTodoService = new CreateTodoService(userRepository);

    const result = await createTodoService.execute({
      description: `valid_description_but_to_long_${"a".repeat(255)}`,
      ownerId: crypto.randomUUID(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.getValue()).toBeInstanceOf(ErrorBundle);
  });

  test("Deve estourar um DatabaseError o banco de dados falhe", async () => {
    const userRepository = new InMemoryTodoRepository();
    const createTodoService = new CreateTodoService(userRepository);

    vi.spyOn(userRepository, "save").mockRejectedValue("");

    const result = createTodoService.execute({
      description: "valid_description",
      ownerId: crypto.randomUUID(),
    });

    expect(result).rejects.toThrow(
      new DatabaseError(Message.DB_ERROR_CREATING_TODO)
    );
  });
});
