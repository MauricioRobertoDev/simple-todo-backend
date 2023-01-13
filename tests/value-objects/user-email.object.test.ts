import { describe, expect, test } from "vitest";

import { ErrorBundle } from "@/shared/error-bundle";
import { UserEmail } from "@/objects/user-email.object";
import { Message } from "@/util/messages";

describe("UserEmail", () => {
  test("Deve retornar um UserName com valor formatado corretamente", () => {
    const emailOrErros = UserEmail.create("VaLid_EmAiL@dOmain.com");
    expect(emailOrErros.isRight()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(UserEmail);
    expect((emailOrErros.getValue() as UserEmail).value).toBe(
      "valid_email@domain.com"
    );
  });

  test("Deve retornar um ErrorBundle caso passe email vazio", () => {
    let emailOrErros = UserEmail.create("");
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_REQUIRED);

    emailOrErros = UserEmail.create(" ");
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_REQUIRED);
  });

  test("Deve retornar um ErrorBundle caso passe um tipo any não compatível", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyValue: any = 100;
    const emailOrErros = UserEmail.create(anyValue);
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_INVALID);
  });

  test("Deve retornar um ErrorBundle caso tenha mais de 255 caracteres", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const as = "a".repeat(256);
    const emailOrErros = UserEmail.create(
      `em${as}il_valid_but_to_long@abc.com`
    );
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_TO_LONG);
  });
});
