import request from "supertest";
import { describe, expect, test } from "vitest";

import { app } from "@/server";
import { Message } from "@/util/messages";

describe("Signup", () => {
  test("[e2e] Deve logar um usuário na aplicação e retornar seu token de acesso", async () => {
    const response = await request(app).post("/entrar").send({
      name: "valid_name",
      email: "valid_email@domain.com",
      password: "valid_password",
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.message).toBe(Message.LOGIN_SUCCESS);
  });
});
