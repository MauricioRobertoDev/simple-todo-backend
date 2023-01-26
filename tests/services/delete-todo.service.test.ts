import { describe, expect, test, vi } from "vitest";
import { DeleteTodoService } from "@/services";
import { ErrorBundle } from "@/shared/error-bundle";
import { Todo } from "@/entities";
import { Message } from "@/util/messages";
import { DatabaseError } from "@/errors/database.error";
import { InMemoryTodoRepository } from "../repositories/in-memory-todo.repository";
import crypto from "node:crypto";

describe("DeleteTodoService", () => {
  test("Deve deletar uma todo", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const deleteTodoService = new DeleteTodoService(todoRepository);

    const ownerId = crypto.randomUUID();

    const todo = Todo.create({
      description: "valid_description",
      ownerId: ownerId,
      createdAt: new Date(Date.now()),
    }).getValue() as Todo;

    await todoRepository.save(todo);

    // admin
    let result = await deleteTodoService.execute({ id: todo.id });

    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toBe(undefined);

    await todoRepository.save(todo);

    // another user
    result = await deleteTodoService.execute({
      id: todo.id,
      requester: crypto.randomUUID(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.getValue()).toBeInstanceOf(ErrorBundle);

    await todoRepository.save(todo);

    // owner user
    result = await deleteTodoService.execute({
      id: todo.id,
      requester: ownerId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toBe(undefined);
  });

  test("Deve retornar um ErrorBundle caso tenha qualquer erro ao deletar uma todo que não existe", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const deleteTodoService = new DeleteTodoService(todoRepository);

    const todo = Todo.create({
      description: "valid_description",
      ownerId: crypto.randomUUID(),
      createdAt: new Date(Date.now()),
    }).getValue() as Todo;

    // admin
    const result = await deleteTodoService.execute({ id: todo.id });
    expect(result.isLeft()).toBeTruthy();
    expect(result.getValue()).toBeInstanceOf(ErrorBundle);
  });

  test("Deve estourar um DatabaseError o banco de dados falhe", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const deleteTodoService = new DeleteTodoService(todoRepository);

    const todo = Todo.create({
      description: "valid_description",
      ownerId: crypto.randomUUID(),
      createdAt: new Date(Date.now()),
    }).getValue() as Todo;

    await todoRepository.save(todo);

    vi.spyOn(todoRepository, "delete").mockRejectedValue("");

    // admin
    const result = deleteTodoService.execute({ id: todo.id });

    expect(result).rejects.toThrow(
      new DatabaseError(Message.DB_ERROR_DELETING_TODO)
    );
  });
});
