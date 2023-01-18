import { User } from "@/entities";
import { AppError } from "@/errors/app.error";
import { Either, left, right } from "@/errors/either";
import { IService } from "@/interfaces";
import { UserName, UserEmail, UserPassword } from "@/objects";
import { UserRepository } from "@/repositories/interfaces";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

type CreateUserOutput = {
  id: string;
  name: string;
  email: string;
};

export class CreateUserService
  implements IService<CreateUserInput, CreateUserOutput>
{
  constructor(private userRepository: UserRepository) {}

  async execute(
    req: CreateUserInput
  ): Promise<Either<ErrorBundle, CreateUserOutput>> {
    const bundle = ErrorBundle.create();

    const nameOrErrors = UserName.create(req.name);
    const emailOrErrors = UserEmail.create(req.email);
    const passwordOrErrors = UserPassword.create(req.password);

    if (nameOrErrors.isLeft()) bundle.combine(nameOrErrors.getValue());
    if (emailOrErrors.isLeft()) bundle.combine(emailOrErrors.getValue());
    if (passwordOrErrors.isLeft()) bundle.combine(passwordOrErrors.getValue());

    if (bundle.hasErrors()) return left(bundle);

    const name = nameOrErrors.getValue() as UserName;
    const email = emailOrErrors.getValue() as UserEmail;
    const password = passwordOrErrors.getValue() as UserPassword;

    const userOrError = User.create({ name, email, password });

    if (userOrError.isLeft()) return left(userOrError.getValue());

    const exists = await this.userRepository.exists(email.value);

    if (exists) {
      return left(bundle.add(new AppError("email", Message.EMAIL_IN_USE)));
    }

    const user = await this.userRepository.save(
      userOrError.getValue().getData()
    );

    return right(user.getData());
  }
}
