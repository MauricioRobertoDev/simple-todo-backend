import { describe, expect, test } from "vitest";

import { TodoStatus } from "@/objects";

describe("TodoStatus", () => {
  test("Deve retornar um TodoStatus correto", () => {
    let descriptionOrErrors = TodoStatus.create();
    expect(descriptionOrErrors.isRight()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(TodoStatus);
    expect((descriptionOrErrors.getValue() as TodoStatus).value).toBe(
      "NOT_STARTED"
    );

    descriptionOrErrors = TodoStatus.create(new Date(Date.now()));
    expect(descriptionOrErrors.isRight()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(TodoStatus);
    expect((descriptionOrErrors.getValue() as TodoStatus).value).toBe(
      "IN_PROGRESS"
    );

    descriptionOrErrors = TodoStatus.create(
      new Date(Date.now()),
      new Date(Date.now())
    );
    expect(descriptionOrErrors.isRight()).toBeTruthy();
    expect(descriptionOrErrors.getValue()).toBeInstanceOf(TodoStatus);
    expect((descriptionOrErrors.getValue() as TodoStatus).value).toBe("DONE");
  });
});
