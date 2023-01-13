import { describe, expect, test } from "vitest";

import { ErrorBundle } from "@/shared/error-bundle";
import { UserName } from "@/objects/user-name.object";
import { Message } from "@/util/messages";

describe("UserName", () => {
  test("Deve retornar um UserName com valor formatado corretamente", () => {
    const emailOrErros = UserName.create("valid_name");
    expect(emailOrErros.isRight()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(UserName);
    expect((emailOrErros.getValue() as UserName).value).toBe("valid_name");
  });

  test("Deve retornar um ErrorBundle caso passe name vazio", () => {
    let emailOrErros = UserName.create("");
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.FIELD_REQUIRED);

    emailOrErros = UserName.create(" ");
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.FIELD_REQUIRED);
  });

  test("Deve retornar um ErrorBundle caso passe um tipo any não compatível", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyValue: any = 100;
    const emailOrErros = UserName.create(anyValue);
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.NEEDS_TO_BE_A_STRING);
  });

  test("Deve retornar um ErrorBundle caso tenha mais de 255 caracteres", () => {
    const as = "a".repeat(256);
    const emailOrErros = UserName.create(`na${as}me_valid_but_to_long`);
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.NAME_LONG);
  });

  test("Deve retornar um ErrorBundle caso tenha menos de 3 caracteres", () => {
    const emailOrErros = UserName.create(`ab`);
    expect(emailOrErros.isLeft()).toBeTruthy();
    expect(emailOrErros.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (emailOrErros.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.NAME_SHORT);
  });
});
