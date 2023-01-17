import { describe, expect, test } from "vitest";

import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";
import { UserPassword } from "@/objects/user-password.object";
import { hashSync } from "bcrypt";

describe("UserPassword", () => {
  test("Deve retornar um UserPassword corretamente", () => {
    const passOrErrors = UserPassword.create("valid_123_password");
    expect(passOrErrors.isRight()).toBeTruthy();
    expect(passOrErrors.getValue()).toBeInstanceOf(UserPassword);

    const compare = (passOrErrors.getValue() as UserPassword).comparePasswords(
      "valid_123_password"
    );
    expect(compare).toBeTruthy();
  });

  test("Deve retornar um UserPassword corretamente passando uma senha já encripitada", () => {
    const encryptedPassword = hashSync("valid_123_password", 10);
    const passOrErrors = UserPassword.create(encryptedPassword);

    expect(passOrErrors.isRight()).toBeTruthy();
    expect(passOrErrors.getValue()).toBeInstanceOf(UserPassword);
    expect((passOrErrors.getValue() as UserPassword).getValue()).toBe(
      encryptedPassword
    );
    expect(
      (passOrErrors.getValue() as UserPassword).comparePasswords(
        "valid_123_password"
      )
    ).toBeTruthy();
  });

  test("Deve retornar um ErrorBundle caso passe name vazio", () => {
    let passwordOrErrors = UserPassword.create("");
    expect(passwordOrErrors.isLeft()).toBeTruthy();
    expect(passwordOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (passwordOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.FIELD_REQUIRED);

    passwordOrErrors = UserPassword.create(" ");
    expect(passwordOrErrors.isLeft()).toBeTruthy();
    expect(passwordOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (passwordOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.FIELD_REQUIRED);
  });

  test("Deve retornar um ErrorBundle caso passe um tipo any não compatível", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyValue: any = 100;
    const passwordOrErrors = UserPassword.create(anyValue);
    expect(passwordOrErrors.isLeft()).toBeTruthy();
    expect(passwordOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (passwordOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.NEEDS_TO_BE_A_STRING);
  });

  test("Deve retornar um ErrorBundle caso tenha mais de 20 caracteres", () => {
    const as = "a".repeat(256);
    const passwordOrErrors = UserPassword.create(
      `pa${as}ssword_valid_but_to_long`
    );
    expect(passwordOrErrors.isLeft()).toBeTruthy();
    expect(passwordOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (passwordOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.PASSWORD_LONG);
  });

  test("Deve retornar um ErrorBundle caso tenha menos de 6 caracteres", () => {
    const passwordOrErrors = UserPassword.create(`ab`);
    expect(passwordOrErrors.isLeft()).toBeTruthy();
    expect(passwordOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (passwordOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.PASSWORD_SHORT);
  });
});
