import request from "supertest";
import { describe, expect, test } from "vitest";
import { app } from "@/server";
import { Message } from "@/util/messages";
import { HttpStatus } from "@/util/http-status";
import { AuthService } from "@/services";
import prisma from "@/database/prisma.client";
import crypto from "node:crypto";

describe("EditTodo", () => {
  test("[e2e] Deve retornar não autorizado caso tente criar uma todo sem estar logado", async () => {
    const response = await request(app).post(
      `/atualizar-status-todo/${crypto.randomUUID()}`
    );

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe(Message.INVALID_ACCESS_TOKEN);
  });

  test("[e2e] Deve atualizar o status de uma todo", async () => {
    const user = await prisma.userModel.create({
      data: {
        id: crypto.randomUUID(),
        name: "valid_name",
        email: "valid_email@domain.com",
        password: "valid_password",
      },
    });

    const todo = await prisma.todoModel.create({
      data: {
        id: crypto.randomUUID(),
        description: "valid_description",
        ownerId: user.id,
      },
    });

    const token = AuthService.generateJwtToken({ id: user.id });

    const response = await request(app)
      .post(`/atualizar-status-todo/${todo.id}`)
      .set("authorization", "Bearer " + token);

    let newTodo = await prisma.todoModel.findFirst({
      where: { id: todo.id },
    });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.message).toBe(Message.UPDATED_TODO);
    expect(newTodo?.id).toBe(todo.id);
    expect(newTodo?.startAt).toBeInstanceOf(Date);
    expect(newTodo?.endAt).toBe(null);

    await request(app)
      .post(`/atualizar-status-todo/${todo.id}`)
      .set("authorization", "Bearer " + token);

    newTodo = await prisma.todoModel.findFirst({
      where: { id: todo.id },
    });

    expect(newTodo?.startAt).toBeInstanceOf(Date);
    expect(newTodo?.endAt).toBeInstanceOf(Date);
  });

  test("[e2e] Deve retornar um erro caso o id passado não seja válido", async () => {
    const user = await prisma.userModel.create({
      data: {
        id: crypto.randomUUID(),
        name: "valid_name",
        email: "valid_email_2@domain.com",
        password: "valid_password",
      },
    });

    const token = AuthService.generateJwtToken({ id: user.id });

    const response = await request(app)
      .post(`/atualizar-status-todo/${crypto.randomUUID()}`)
      .set("authorization", "Bearer " + token);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.id[0]).toBe(Message.TODO_NOT_FOUND);
    expect(response.body.message).toBe(Message.VALIDATION_ERRORS);
  });
});
