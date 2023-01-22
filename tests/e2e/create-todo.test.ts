import request from "supertest";
import { describe, expect, test } from "vitest";
import { app } from "@/server";
import { Message } from "@/util/messages";
import { HttpStatus } from "@/util/http-status";
import { AuthService } from "@/services";
import prisma from "@/database/prisma.client";
import crypto from "node:crypto";

describe("Signin", () => {
  test("[e2e] Deve retornar não autorizado caso tente criar uma todo sem estar logado", async () => {
    const response = await request(app).post("/nova-todo").send({
      description: "valid_description",
    });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe(Message.INVALID_ACCESS_TOKEN);
  });

  test("[e2e] Deve criar uma nova todo para o usuário logado", async () => {
    const userModel = await prisma.userModel.create({
      data: {
        id: crypto.randomUUID(),
        name: "valid_name",
        email: "valid_email@domain.com",
        password: "valid_password",
      },
    });

    const token = AuthService.generateJwtToken({ id: userModel.id });

    const response = await request(app)
      .post("/nova-todo")
      .set("authorization", "Bearer " + token)
      .send({
        description: "valid_description",
      });

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.message).toBe(Message.CREATED_TODO);
  });

  test("[e2e] Deve retornar os erros caso tenha", async () => {
    const userModel = await prisma.userModel.create({
      data: {
        id: crypto.randomUUID(),
        name: "valid_name",
        email: "valid_email_2@domain.com",
        password: "valid_password",
      },
    });

    const token = AuthService.generateJwtToken({ id: userModel.id });

    const response = await request(app)
      .post("/nova-todo")
      .set("authorization", "Bearer " + token)
      .send({
        description: "valid_description" + "a".repeat(255),
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(Message.VALIDATION_ERRORS);
  });
});
