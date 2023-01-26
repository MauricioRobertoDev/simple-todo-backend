import request from "supertest";
import { describe, expect, test } from "vitest";
import { app } from "@/server";
import { Message } from "@/util/messages";
import { HttpStatus } from "@/util/http-status";
import { AuthService } from "@/services";
import prisma from "@/database/prisma.client";
import crypto from "node:crypto";

describe("DeleteTodo", () => {
  test("[e2e] Deve retornar não autorizado caso tente deletar uma todo sem estar logado", async () => {
    const response = await request(app).delete(
      `/excluir-todo/${crypto.randomUUID()}`
    );

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe(Message.INVALID_ACCESS_TOKEN);
  });

  test("[e2e] Deve excluir uma todo", async () => {
    const user = await prisma.userModel.create({
      data: {
        id: crypto.randomUUID(),
        name: "valid_name",
        email: "valid_email@domain.com",
        password: "valid_password",
      },
    });
    const user2 = await prisma.userModel.create({
      data: {
        id: crypto.randomUUID(),
        name: "valid_name_2",
        email: "valid_email_2@domain.com",
        password: "valid_password_2",
      },
    });

    const todo = await prisma.todoModel.create({
      data: {
        id: crypto.randomUUID(),
        description: "valid_description",
        ownerId: user.id,
      },
    });
    const todoWithoutOwner = await prisma.todoModel.create({
      data: {
        id: crypto.randomUUID(),
        description: "valid_description",
        ownerId: user2.id,
      },
    });

    const token = AuthService.generateJwtToken({ id: user.id });

    let response = await request(app)
      .delete(`/excluir-todo/${todo.id}`)
      .set("authorization", "Bearer " + token);

    let deletedTodo = await prisma.todoModel.findFirst({
      where: { id: todo.id },
    });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.message).toBe(Message.DELETED_TODO);
    expect(deletedTodo).toBe(null);

    response = await request(app)
      .delete(`/excluir-todo/${todoWithoutOwner.id}`)
      .set("authorization", "Bearer " + token);

    deletedTodo = await prisma.todoModel.findFirst({
      where: { id: todoWithoutOwner.id },
    });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.id[0]).toBe(Message.TODO_NOT_FOUND);
    expect(response.body.message).toBe(Message.VALIDATION_ERRORS);
    expect(deletedTodo).toBeDefined();
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  test("[e2e] Deve retornar um erro caso o id passado não seja válido", async () => {
    const user = await prisma.userModel.create({
      data: {
        id: crypto.randomUUID(),
        name: "valid_name_3",
        email: "valid_email_3@domain.com",
        password: "valid_password_3",
      },
    });

    const token = AuthService.generateJwtToken({ id: user.id });

    const response = await request(app)
      .delete(`/excluir-todo/${crypto.randomUUID()}`)
      .set("authorization", "Bearer " + token);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.id[0]).toBe(Message.TODO_NOT_FOUND);
    expect(response.body.message).toBe(Message.VALIDATION_ERRORS);
  });
});
