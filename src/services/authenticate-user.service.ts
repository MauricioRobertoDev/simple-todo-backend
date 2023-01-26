import { User } from "@/entities";
import { AppError } from "@/errors/app.error";
import { Either, left, right } from "@/errors/either";
import { ServerError } from "@/errors/server.error";
import { IService } from "@/interfaces";
import { UserEmail } from "@/objects";
import { UserRepository } from "@/repositories/interfaces";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";
import { AuthService } from "./auth.service";

export type AuthenticationInput = {
  email: string;
  password: string;
};

export class AuthenticateUserService
  implements IService<AuthenticationInput, User>
{
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticationInput): Promise<Either<ErrorBundle, User>> {
    const bundle = ErrorBundle.create();
    const emailOrErrors = UserEmail.create(email);

    if (emailOrErrors.isLeft()) return left(emailOrErrors.getValue());

    const user = await this.userRepository.findByEmail(
      emailOrErrors.getValue().getValue()
    );

    if (!user || !user.password.comparePasswords(password)) {
      bundle.add(new AppError("password", Message.INCORRECT_CREDENTIALS));
      return left(bundle);
    }

    const secret = process.env.APP_SECRET;

    if (!secret) throw new ServerError(Message.SECRET_NOT_DEFINED);

    const token = AuthService.generateJwtToken({ id: user.id });

    user.setAccessToken(token);

    return right(user);
  }
}
