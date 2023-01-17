import { AppError } from "@/errors/app.error";
import { Either, left, right } from "@/errors/either";
import { ErrorBundle } from "@/shared/error-bundle";
import { Message } from "@/util/messages";
import { isLongerThan, isShorterThan, isString } from "@/validations";
import bcrypt from "bcrypt";

const isEncryptPass = /\$2b\$\d\d\$[\s\S]{53}|{.}\b/gm;

export class UserPassword {
  private constructor(private value: string) {}

  static create(value: string): Either<ErrorBundle, UserPassword> {
    const bundle = ErrorBundle.create();
    const isEncryptedPassword = isEncryptPass.test(value);

    if (!isString(value)) {
      bundle.add(new AppError("password", Message.NEEDS_TO_BE_A_STRING));
      return left(bundle);
    }

    if (!value.trim()) {
      bundle.add(new AppError("password", Message.FIELD_REQUIRED));
      return left(bundle);
    }

    if (!isEncryptedPassword) {
      if (isLongerThan(value, 20)) {
        bundle.add(new AppError("password", Message.PASSWORD_LONG));
      }

      if (isShorterThan(value, 6)) {
        bundle.add(new AppError("password", Message.PASSWORD_SHORT));
      }
    }

    if (bundle.hasErrors()) return left(bundle);

    const pass = new UserPassword(value);

    if (!isEncryptedPassword) {
      pass.encryptPassword();
      console.log("encripitei - > ", value);
    }

    return right(pass);
  }

  public encryptPassword(): void {
    this.value = bcrypt.hashSync(this.value, 10);
  }

  public comparePasswords(plainText: string): boolean {
    return bcrypt.compareSync(plainText, this.value);
  }

  public getValue(): string {
    return this.value;
  }
}
