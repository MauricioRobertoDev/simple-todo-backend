import request from "supertest";
import { describe, expect, test } from "vitest";

import { app } from "@/server";
import { Message } from "@/util/messages";
import { HttpStatus } from "@/util/http-status";

describe("Signin", () => {
  test("[e2e] Deve logar um usuário na aplicação e retornar seu token de acesso", async () => {
    await request(app).post("/registrar").send({
      name: "valid_name",
      email: "valid_email@domain.com",
      password: "valid_password",
    });

    const response = await request(app).post("/entrar").send({
      name: "valid_name",
      email: "valid_email@domain.com",
      password: "valid_password",
    });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.message).toBe(Message.LOGIN_SUCCESS);
  });

  test("[e2e] Deve lretornar um erro e não deixar logar caso as credenciais sejam inválidas", async () => {
    const response = await request(app).post("/entrar").send({
      name: "valid_name",
      email: "valid_email@domain.com",
      password: "valid_password",
    });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body).toBeDefined();
    expect(response.body.data).not.toBeDefined();
    expect(response.body.errors).toBeDefined();
    expect(response.body.message).toBe(Message.VALIDATION_ERRORS);
    expect(response.body.errors.password[0]).toBe(
      Message.INCORRECT_CREDENTIALS
    );
  });
});
