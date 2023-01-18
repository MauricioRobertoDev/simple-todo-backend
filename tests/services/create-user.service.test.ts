import { describe, expect, test } from "vitest";
import { InMemoryUserRepository } from "../repositories/in-memory-user.repository";
import { CreateUserOutput, CreateUserService } from "@/services";
import { ErrorBundle } from "@/shared/error-bundle";

describe("CreateUserService", () => {
  test("Deve retornar um CreateUserOutput", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUserService = new CreateUserService(userRepository);

    const result = await createUserService.execute({
      name: "valid_nAme",
      email: "vAlid_Email@domain.cOM",
      password: "valid_password",
    });

    expect(result.isRight()).toBeTruthy();
    const data = result.getValue() as CreateUserOutput;
    expect(data.name).toBe("valid_name");
    expect(data.email).toBe("valid_email@domain.com");
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
});
