import { describe, expect, test } from "vitest";

import { ErrorBundle } from "@/shared/error-bundle";
import { TodoDescription } from "@/objects";
import { Message } from "@/util/messages";

describe("TodoDescription", () => {
  test("Deve retornar um TodoDescription", () => {
    const descriptionOrErrors = TodoDescription.create("valid_description");
    expect(descriptionOrErrors.isRight()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(TodoDescription);
    expect((descriptionOrErrors.getValue() as TodoDescription).value).toBe(
      "valid_description"
    );
  });

  test("Deve retornar um ErrorBundle caso passe name vazio", () => {
    let descriptionOrErrors = TodoDescription.create("");
    expect(descriptionOrErrors.isLeft()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (descriptionOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.FIELD_REQUIRED);

    descriptionOrErrors = TodoDescription.create(" ");
    expect(descriptionOrErrors.isLeft()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (descriptionOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.FIELD_REQUIRED);
  });

  test("Deve retornar um ErrorBundle caso passe um tipo any não compatível", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyValue: any = 100;
    const descriptionOrErrors = TodoDescription.create(anyValue);
    expect(descriptionOrErrors.isLeft()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (descriptionOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.NEEDS_TO_BE_A_STRING);
  });

  test("Deve retornar um ErrorBundle caso tenha mais de 255 caracteres", () => {
    const as = "a".repeat(255);
    const descriptionOrErrors = TodoDescription.create(
      `description${as}_valid_but_to_long`
    );
    expect(descriptionOrErrors.isLeft()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (descriptionOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.TODO_DESCRIPTION_LONG);
  });

  test("Deve retornar um ErrorBundle caso tenha menos de 3 caracteres", () => {
    const descriptionOrErrors = TodoDescription.create(`ab`);
    expect(descriptionOrErrors.isLeft()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(ErrorBundle);
    expect(
      (descriptionOrErrors.getValue() as ErrorBundle).getErrors()[0].message
    ).toBe(Message.TODO_DESCRIPTION_SHORT);
  });
});
