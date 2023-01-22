import { AppError } from "@/errors/app.error";
import { Either, left, right } from "@/errors/either";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";
import { isString, isLongerThan, isShorterThan } from "@/validations";

export class TodoDescription {
  private constructor(public readonly value: string) {}

  static create(value: string): Either<ErrorBundle, TodoDescription> {
    const bundle = ErrorBundle.create();

    if (!isString(value)) {
      bundle.add(new AppError("description", Message.NEEDS_TO_BE_A_STRING));
      return left(bundle);
    }

    if (!value.trim()) {
      bundle.add(new AppError("description", Message.FIELD_REQUIRED));
      return left(bundle);
    }

    if (isLongerThan(value, 255)) {
      bundle.add(new AppError("description", Message.TODO_DESCRIPTION_LONG));
    }

    if (isShorterThan(value, 3)) {
      bundle.add(new AppError("description", Message.TODO_DESCRIPTION_SHORT));
    }

    if (bundle.hasErrors()) {
      return left(bundle);
    }

    return right(new TodoDescription(value));
  }

  public getValue(): string {
    return this.value;
  }
}
