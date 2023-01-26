import { describe, expect, test } from "vitest";
import { InMemoryUserRepository } from "../repositories/in-memory-user.repository";
import { CreateUserService, AuthenticateUserService } from "@/services";
import { ErrorBundle } from "@/shared/error-bundle";
import { User } from "@/entities";
import { ServerError } from "@/errors/server.error";
import { Message } from "@/util/messages";

describe("AuthenticateUserService", () => {
  test("Deve retornar um User logado", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUserService = new CreateUserService(userRepository);
    const authenticateUserService = new AuthenticateUserService(userRepository);

    const user = (
      await createUserService.execute({
        name: "valid_name",
        email: "valid_email@domain.com",
        password: "valid_password",
      })
    ).getValue() as User;

    expect(user.isLoggedIn()).toBeFalsy();

    let result = (
      await authenticateUserService.execute({
        email: "valid_email@domain.com",
        password: "valid_password",
      })
    ).getValue();

    expect(result).toBeInstanceOf(User);
    result = result as User;
    expect(result.isLoggedIn()).toBeTruthy();
    expect(result.accessToken).toBeDefined();
    expect(result.isLoggedIn()).toBeTruthy();
  });

  test("Deve estourar um ServerError caso APP_SECRET não tenha sido definido", async () => {
    delete process.env.APP_SECRET;
    const userRepository = new InMemoryUserRepository();
    const createUserService = new CreateUserService(userRepository);
    const authenticateUserService = new AuthenticateUserService(userRepository);

    await createUserService.execute({
      name: "valid_name",
      email: "valid_email@domain.com",
      password: "valid_password",
    });

    const result = authenticateUserService.execute({
      email: "valid_email@domain.com",
      password: "valid_password",
    });

    expect(result).rejects.toThrow(new ServerError(Message.SECRET_NOT_DEFINED));
  });

  test("Deve retornar um ErrorBundle caso a senha não seja a correta", async () => {
    delete process.env.APP_SECRET;
    const userRepository = new InMemoryUserRepository();
    const createUserService = new CreateUserService(userRepository);
    const authenticateUserService = new AuthenticateUserService(userRepository);

    await createUserService.execute({
      name: "valid_name",
      email: "valid_email@domain.com",
      password: "valid_password",
    });

    const result = await authenticateUserService.execute({
      email: "valid_email@domain.com",
      password: "invalid_password",
    });

    expect(result.isLeft()).toBeTruthy();
    expect((result.getValue() as ErrorBundle).getErrors()[0].message).toBe(
      Message.INCORRECT_CREDENTIALS
    );
  });

  test("Deve retornar um ErrorBundle envie um tipo inválido de email", async () => {
    delete process.env.APP_SECRET;
    const userRepository = new InMemoryUserRepository();
    const authenticateUserService = new AuthenticateUserService(userRepository);

    const result = await authenticateUserService.execute({
      email: "invalid_emaildomain.com",
      password: "invalid_password",
    });

    expect(result.isLeft()).toBeTruthy();
    expect((result.getValue() as ErrorBundle).getErrors()[0].message).toBe(
      Message.EMAIL_INVALID
    );
  });
});
