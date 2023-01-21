import request from "supertest";
import { describe, expect, test } from "vitest";

import { app } from "@/server";
import { Message } from "@/util/messages";
import { HttpStatus } from "@/util/http-status";

describe("Signup", () => {
  test("[e2e] Deve criar um usuário", async () => {
    const response = await request(app).post("/registrar").send({
      name: "valid_name",
      email: "valid_email@domain.com",
      password: "valid_password",
    });

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe(Message.CREATED_ACCOUNT);
  });

  test("[e2e] Deve retornar os erros corretamente", async () => {
    const response = await request(app).post("/registrar").send({
      name: "invalid_name_too_looooooooooooooong",
      email: "invalid_email@domain",
      password: "invalid_password_too_looooooooooooooong",
    });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toBeDefined();
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.name[0]).toBe(Message.NAME_LONG);
    expect(response.body.errors.email[0]).toBe(Message.EMAIL_INVALID);
    expect(response.body.errors.password[0]).toBe(Message.PASSWORD_LONG);
  });
});
