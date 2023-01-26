import request from "supertest";
import { describe, expect, test } from "vitest";
import { app } from "@/server";
import { Message } from "@/util/messages";
import { HttpStatus } from "@/util/http-status";
import { AuthService } from "@/services";
import prisma from "@/database/prisma.client";
import crypto from "node:crypto";

describe("ListTodo", () => {
  test("[e2e] Deve retornar não autorizado caso tente listar todos sem estar logado", async () => {
    const response = await request(app).get(`/listar-todos`);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe(Message.INVALID_ACCESS_TOKEN);
  });

  test("[e2e] Deve listar todos do usuário", async () => {
    const user = await prisma.userModel.create({
      data: {
        id: crypto.randomUUID(),
        name: "valid_name",
        email: "valid_email@domain.com",
        password: "valid_password",
      },
    });

    await prisma.todoModel.createMany({
      data: [
        {
          id: crypto.randomUUID(),
          description: "valid_description_1",
          ownerId: user.id,
        },
        {
          id: crypto.randomUUID(),
          description: "valid_description_2",
          ownerId: user.id,
        },
        {
          id: crypto.randomUUID(),
          description: "valid_description_3",
          ownerId: user.id,
        },
      ],
    });

    const token = AuthService.generateJwtToken({ id: user.id });

    const response = await request(app)
      .get(`/listar-todos`)
      .set("authorization", "Bearer " + token);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.message).toBe(Message.LISTED_TODOS);
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect((response.body.data as []).length).toBe(3);
  });
});
