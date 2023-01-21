import { describe, expect, test, vi } from "vitest";
import { InMemoryUserRepository } from "../repositories/in-memory-user.repository";
import { CreateUserService } from "@/services";
import { ErrorBundle } from "@/shared/error-bundle";
import { User } from "@/entities";

import { Message } from "@/util/messages";
import { DatabaseError } from "@/errors/database.error";

describe("CreateUserService", () => {
  test("Deve retornar um User", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUserService = new CreateUserService(userRepository);

    const result = await createUserService.execute({
      name: "valid_nAme",
      email: "vAlid_Email@domain.cOM",
      password: "valid_password",
    });

    expect(result.isRight()).toBeTruthy();
    const data = result.getValue() as User;
    expect(data.name.getValue()).toBe("valid_name");
    expect(data.email.getValue()).toBe("valid_email@domain.com");
  });

  test("Deve retornar um ErrorBundle caso tenha qualquer erro na criação", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUserService = new CreateUserService(userRepository);

    const result = await createUserService.execute({
      name: "invalid_nAme_so_long_user_name_for_create",
      email: "invAlid_Emaildomain.cOM",
      password: "abc",
    });

    expect(result.isLeft()).toBeTruthy();

    const data = result.getValue() as ErrorBundle;

    expect(data.hasErrors()).toBeTruthy();
    expect(data.size()).toBe(3);
  });

  test("Deve retornar um ErrorBundle caso o email já esteja sendo ultilizado", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUserService = new CreateUserService(userRepository);

    const result1 = await createUserService.execute({
      name: "valid_nAme",
      email: "vAlid_Email@domain.cOM",
      password: "valid_password",
    });

    const result2 = await createUserService.execute({
      name: "valid_nAme",
      email: "vAlid_Email@domain.cOM",
      password: "valid_password",
    });

    expect(result1.isRight()).toBeTruthy();
    expect(result2.isLeft()).toBeTruthy();
    expect((result2.getValue() as ErrorBundle).size()).toBe(1);
  });

  test("Deve estourar um DatabaseError o banco de dados falhe", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUserService = new CreateUserService(userRepository);

    vi.spyOn(userRepository, "save").mockRejectedValue("");

    const result = createUserService.execute({
      name: "valid_nAme",
      email: "vAlid_Email@domain.cOM",
      password: "valid_password",
    });

    expect(result).rejects.toThrow(
      new DatabaseError(Message.DB_ERROR_CREATING_USER)
    );
  });
});
