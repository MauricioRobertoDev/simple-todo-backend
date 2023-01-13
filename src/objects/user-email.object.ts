import { AppError } from "@/errors/app.error";
import { Either, left, right } from "@/errors/either";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";
import { isString, isEmail, isLongerThan } from "@/validations";

export class UserEmail {
  private constructor(public readonly value: string) {}

  static create(value: string): Either<ErrorBundle, UserEmail> {
    const bundle = ErrorBundle.create();

    if (!isString(value)) {
      bundle.add(new AppError("email", Message.EMAIL_INVALID));
      return left(bundle);
    }

    value = value as string;

    if (!value.trim()) {
      bundle.add(new AppError("email", Message.EMAIL_REQUIRED));
      return left(bundle);
    }

    if (!isEmail(value)) {
      bundle.add(new AppError("email", Message.EMAIL_INVALID));
    }

    if (isLongerThan(value, 255)) {
      bundle.add(new AppError("email", Message.EMAIL_TO_LONG));
    }

    if (bundle.hasErrors()) {
      return left(bundle);
    }

    return right(new UserEmail(value.toLocaleLowerCase()));
  }
}
