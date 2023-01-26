import { describe, expect, test, vi } from "vitest";
import { EditTodoService, UpdateStatusTodoService } from "@/services";
import { Todo } from "@/entities";
import { Message } from "@/util/messages";
import { DatabaseError } from "@/errors/database.error";
import { InMemoryTodoRepository } from "../repositories/in-memory-todo.repository";
import crypto from "node:crypto";
import { ErrorBundle } from "@/shared/error-bundle";

describe("UpdateStatusTodoService", () => {
  test("Deve editar o status de uma todo", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const editTodoService = new EditTodoService(todoRepository);
    const updateStatusTodoService = new UpdateStatusTodoService(
      todoRepository,
      editTodoService
    );

    const todo = Todo.create({
      description: "valid_description",
      ownerId: crypto.randomUUID(),
      createdAt: new Date(Date.now()),
    }).getValue() as Todo;

    expect(todo.startAt).not.toBeDefined();
    expect(todo.status.getValue()).toBe("NOT_STARTED");

    await todoRepository.save(todo);

    let result = (
      await updateStatusTodoService.execute({
        id: todo.id,
      })
    ).getValue();

    let updatedTodo = await todoRepository.findById(todo.id);

    expect(updatedTodo?.startAt).toBeDefined();

    expect(result).toBeInstanceOf(Todo);
    result = result as Todo;
    expect(result.startAt).toBeDefined();
    expect(result.endAt).not.toBeDefined();
    expect(result.status.getValue()).toBe("IN_PROGRESS");

    let result2 = (
      await updateStatusTodoService.execute({
        id: todo.id,
      })
    ).getValue();

    updatedTodo = await todoRepository.findById(todo.id);

    expect(updatedTodo?.startAt).toBeDefined();
    expect(updatedTodo?.endAt).toBeDefined();

    expect(result2).toBeInstanceOf(Todo);
    result2 = result2 as Todo;
    expect(result2.startAt).toBeDefined();
    expect(result2.startAt?.toDateString).toBe(result.startAt?.toDateString);
    expect(result2.endAt).toBeDefined();
    expect(result2.status.getValue()).toBe("DONE");
  });

  test("Deve retornar um ErrorBundle com os errors", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const editTodoService = new EditTodoService(todoRepository);
    const updateStatusTodoService = new UpdateStatusTodoService(
      todoRepository,
      editTodoService
    );

    const result = await updateStatusTodoService.execute({
      id: "invalid_todo_id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.getValue()).toBeInstanceOf(ErrorBundle);
  });

  test("Deve estourar um DatabaseError o banco de dados falhe", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const editTodoService = new EditTodoService(todoRepository);
    const updateStatusTodoService = new UpdateStatusTodoService(
      todoRepository,
      editTodoService
    );

    const todo = Todo.create({
      description: "valid_description",
      ownerId: crypto.randomUUID(),
      createdAt: new Date(Date.now()),
    });

    await todoRepository.save(todo.getValue() as Todo);

    vi.spyOn(todoRepository, "save").mockRejectedValue("");

    const result = updateStatusTodoService.execute({
      id: (todo.getValue() as Todo).id,
    });

    expect(result).rejects.toThrow(
      new DatabaseError(Message.DB_ERROR_UPDATING_TODO)
    );
  });
});
