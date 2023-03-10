import { describe, expect, test } from "vitest";

import { ErrorBundle } from "@/shared/error-bundle";
import { UserEmail } from "@/objects/user-email.object";
import { Message } from "@/util/messages";
import { Left, Right } from "@/errors/either";

describe("UserEmail", () => {
  test("Deve retornar um UserEmail com valor formatado corretamente", () => {
    const emailOrErrors = UserEmail.create("VaLid_EmAiL@dOmain.com");
    expect(emailOrErrors.isRight()).toBeTruthy();
    expect(emailOrErrors.isLeft()).toBeFalsy();
    expect(emailOrErrors).toBeInstanceOf(Right);
    expect(emailOrErrors.getValue()).toBeInstanceOf(UserEmail);
    expect((emailOrErrors.getValue() as UserEmail).value).toBe(
      "valid_email@domain.com"
    );
  });

  test("Deve retornar um ErrorBundle caso passe email vazio", () => {
    let emailOrErrors = UserEmail.create("");
    expect(emailOrErrors.isLeft()).toBeTruthy();
    expect(emailOrErrors.isRight()).toBeFalsy();
    expect(emailOrErrors).toBeInstanceOf(Left);
    expect(emailOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_REQUIRED);

    emailOrErrors = UserEmail.create(" ");
    expect(emailOrErrors.isLeft()).toBeTruthy();
    expect(emailOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_REQUIRED);
  });

  test("Deve retornar um ErrorBundle caso passe um tipo any não compatível", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyValue: any = 100;
    const emailOrErrors = UserEmail.create(anyValue);
    expect(emailOrErrors.isLeft()).toBeTruthy();
    expect(emailOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_INVALID);
  });

  test("Deve retornar um ErrorBundle caso tenha mais de 255 caracteres", () => {
    const as = "a".repeat(256);
    const emailOrErrors = UserEmail.create(
      `em${as}il_valid_but_to_long@abc.com`
    );
    expect(emailOrErrors.isLeft()).toBeTruthy();
    expect(emailOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_TO_LONG);
  });

  test("Deve retornar um ErrorBundle caso um email inválido", () => {
    const invalidEmail = "invalid_email@hotmail";
    const emailOrErrors = UserEmail.create(invalidEmail);
    expect(emailOrErrors.isLeft()).toBeTruthy();
    expect(emailOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.EMAIL_INVALID);
  });
});
