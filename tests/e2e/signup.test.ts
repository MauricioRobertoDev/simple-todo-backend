import { describe, expect, test } from "vitest";
import request from "supertest";

import { app } from "@/server";
import { Message } from "@/util/messages";

describe("Signup", () => {
  test("[e2e] Deve criar um usuário", async () => {
    request(app)
      .post("/registrar")
      .expect(201)
      .send({
        name: "valid_name",
        email: "valid_email@domain.com",
        password: "valid_password",
      })
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
      });
  });

  test("[e2e] Deve retornar os erros corretamente", async () => {
    request(app)
      .post("/registrar")
      .expect(400)
      .send({
        name: "invalid_name_too_looooooooooooooong",
        email: "invalid_email@domain",
        password: "invalid_password_too_looooooooooooooong",
      })
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.name[0]).toBe(Message.NAME_LONG);
        expect(response.body.errors.email[0]).toBe(Message.EMAIL_INVALID);
        expect(response.body.errors.password[0]).toBe(Message.PASSWORD_LONG);
      });
  });
});
