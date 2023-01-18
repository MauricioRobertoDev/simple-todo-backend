import { AppError } from "@/errors/app.error";
import { Either, left, right } from "@/errors/either";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";
import { isString, isLongerThan, isShorterThan } from "@/validations";

export class UserName {
  private constructor(public readonly value: string) {}

  static create(value: string): Either<ErrorBundle, UserName> {
    const bundle = ErrorBundle.create();

    if (!isString(value)) {
      bundle.add(new AppError("name", Message.NEEDS_TO_BE_A_STRING));
      return left(bundle);
    }

    if (!value.trim()) {
      bundle.add(new AppError("name", Message.FIELD_REQUIRED));
      return left(bundle);
    }

    if (isLongerThan(value, 25)) {
      bundle.add(new AppError("name", Message.NAME_LONG));
    }

    if (isShorterThan(value, 3)) {
      bundle.add(new AppError("name", Message.NAME_SHORT));
    }

    if (bundle.hasErrors()) {
      return left(bundle);
    }

    return right(new UserName(value.toLowerCase()));
  }
}
