import { describe, expect, test } from "vitest";
import { InMemoryUserRepository } from "../repositories/in-memory-user.repository";
import { CreateUserService, AuthenticateUserService } from "@/services";
import { ErrorBundle } from "@/shared/error-bundle";
import { User } from "@/entities";
import { ServerError } from "@/errors/server.error";
import { Message } from "@/util/messages";

describe("AuthenticateUserService", () => {
  test("Deve retornar um User logado", async () => {
    process.env.APP_SECRET = "9eb71ab7420eb452a22787ca4fab501b";
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
      password: "valid_password",
    });

    expect(result.isRight()).toBeTruthy();
    expect((result.getValue() as User).isLoggedIn()).toBeTruthy();
    expect((result.getValue() as User).accessToken).toBeDefined();
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