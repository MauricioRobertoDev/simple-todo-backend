import { User } from "@/entities";
import { AppError } from "@/errors/app.error";
import { DatabaseError } from "@/errors/database.error";
import { Either, left, right } from "@/errors/either";
import { IService } from "@/interfaces";
import { UserRepository } from "@/repositories/interfaces";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export class CreateUserService implements IService<CreateUserInput, User> {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserInput): Promise<Either<ErrorBundle, User>> {
    const bundle = ErrorBundle.create();

    const userOrError = User.create({ name, email, password });

    if (userOrError.isLeft()) return left(userOrError.getValue());

    try {
      const exists = await this.userRepository.exists(
        userOrError.getValue().email.getValue()
      );

      if (exists) {
        bundle.add(new AppError("email", Message.EMAIL_IN_USE));
        return left(bundle);
      }

      await this.userRepository.save(userOrError.getValue());

      return right(userOrError.getValue());
    } catch (error) {
      throw new DatabaseError(Message.DB_ERROR_CREATING_USER);
    }
  }
}
