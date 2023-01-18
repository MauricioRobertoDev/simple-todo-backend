import { describe, expect, test } from "vitest";

import { ErrorBundle } from "@/shared/error-bundle";
import { UserName } from "@/objects/user-name.object";
import { Message } from "@/util/messages";

describe("UserName", () => {
  test("Deve retornar um UserName com valor formatado corretamente", () => {
    const nameOrErrors = UserName.create("valid_name");
    expect(nameOrErrors.isRight()).toBeTruthy();
    expect(nameOrErrors.getValue()).toBeInstanceOf(UserName);
    expect((nameOrErrors.getValue() as UserName).value).toBe("valid_name");
  });

  test("Deve retornar um ErrorBundle caso passe name vazio", () => {
    let nameOrErrors = UserName.create("");
    expect(nameOrErrors.isLeft()).toBeTruthy();
    expect(nameOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (nameOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.FIELD_REQUIRED);

    nameOrErrors = UserName.create(" ");
    expect(nameOrErrors.isLeft()).toBeTruthy();
    expect(nameOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (nameOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.FIELD_REQUIRED);
  });

  test("Deve retornar um ErrorBundle caso passe um tipo any não compatível", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyValue: any = 100;
    const nameOrErrors = UserName.create(anyValue);
    expect(nameOrErrors.isLeft()).toBeTruthy();
    expect(nameOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (nameOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.NEEDS_TO_BE_A_STRING);
  });

  test("Deve retornar um ErrorBundle caso tenha mais de 25 caracteres", () => {
    const as = "a".repeat(25);
    const nameOrErrors = UserName.create(`na${as}me_valid_but_to_long`);
    expect(nameOrErrors.isLeft()).toBeTruthy();
    expect(nameOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (nameOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.NAME_LONG);
  });

  test("Deve retornar um ErrorBundle caso tenha menos de 3 caracteres", () => {
    const nameOrErrors = UserName.create(`ab`);
    expect(nameOrErrors.isLeft()).toBeTruthy();
    expect(nameOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (nameOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.NAME_SHORT);
  });
});
