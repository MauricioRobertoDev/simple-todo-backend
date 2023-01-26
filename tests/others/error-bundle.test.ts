import { describe, expect, test } from "vitest";
import { ErrorBundle } from "@/shared/error-bundle";
import { AppError } from "@/errors/app.error";

describe("ErrorBundle", () => {
  test("Deve retornar um array normalizado de erros", async () => {
    const bundle = ErrorBundle.create();
    const bundle2 = ErrorBundle.create();

    bundle.add(new AppError("valid_type", "valid_message"));
    bundle2.add(new AppError("another_valid_type", "another_valid_message"));

    expect(bundle.hasErrors()).toBeTruthy();
    expect(bundle2.hasErrors()).toBeTruthy();

    expect(bundle.size()).toBe(1);
    expect(bundle2.size()).toBe(1);

    bundle.combine(bundle2);

    expect(bundle.hasErrors()).toBeTruthy();
    expect(bundle.size()).toBe(2);

    expect(bundle.getErrorData()).toEqual({
      valid_type: ["valid_message"],
      another_valid_type: ["another_valid_message"],
    });
  });
});
