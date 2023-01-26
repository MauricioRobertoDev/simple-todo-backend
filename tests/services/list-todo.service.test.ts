import { describe, expect, test, vi } from "vitest";
import { ListTodoService } from "@/services";
import { InMemoryTodoRepository } from "../repositories/in-memory-todo.repository";
import { Todo, User } from "@/entities";
import { Message } from "@/util/messages";
import { DatabaseError } from "@/errors/database.error";

describe("ListTodoService", () => {
  test("Deve retornar uma lista de todos", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const listTodoService = new ListTodoService(todoRepository);

    const user = User.create({
      name: "valid_name",
      password: "valid_password",
      email: "valid@email.com",
    }).getValue() as User;

    const todo = Todo.create({
      description: "valid_description",
      ownerId: user.id,
    }).getValue() as Todo;

    let result = (
      await listTodoService.execute({ userId: "invalid_user_id" })
    ).getValue();

    expect(Array.isArray(result)).toBeTruthy();
    expect((result as Todo[]).length).toBe(0);

    result = (await listTodoService.execute({ userId: user.id })).getValue();

    expect(Array.isArray(result)).toBeTruthy();
    expect((result as Todo[]).length).toBe(0);

    await todoRepository.save(todo);

    result = (await listTodoService.execute({ userId: user.id })).getValue();

    expect(Array.isArray(result)).toBeTruthy();
    expect((result as Todo[]).length).toBe(1);
  });

  test("Deve estourar um DatabaseError o banco de dados falhe", async () => {
    const todoRepository = new InMemoryTodoRepository();
    const listTodoService = new ListTodoService(todoRepository);

    vi.spyOn(todoRepository, "findAllByUserId").mockRejectedValue("");

    const result = listTodoService.execute({
      userId: "any_user_id",
    });

    expect(result).rejects.toThrow(
      new DatabaseError(Message.DB_ERROR_LISTING_TODO)
    );
  });
});
