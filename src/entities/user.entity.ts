import { Either, left, right } from "@/errors/either";
import { Entity } from "@/entities/abstract.entity";
import { ErrorBundle } from "@/shared/error-bundle";
import { UserName } from "@/objects/user-name.object";
import { UserPassword } from "@/objects/user-password.object";
import { UserEmail } from "@/objects/user-email.object";

type UserProps = {
  name: UserName;
  email: UserEmail;
  password: UserPassword;
};

type IUser = {
  name: string;
  email: string;
  password: string;
};

export class User extends Entity<UserProps> {
  private constructor(protected props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(data: IUser, id?: string): Either<ErrorBundle, User> {
    const bundle = ErrorBundle.create();

    const nameOrErrors = UserName.create(data.name);
    const emailOrErrors = UserEmail.create(data.email);
    const passwordOrErrors = UserPassword.create(data.password);

    if (nameOrErrors.isLeft()) bundle.combine(nameOrErrors.getValue());
    if (emailOrErrors.isLeft()) bundle.combine(emailOrErrors.getValue());
    if (passwordOrErrors.isLeft()) bundle.combine(passwordOrErrors.getValue());

    if (bundle.hasErrors()) return left(bundle);

    const name = nameOrErrors.getValue() as UserName;
    const email = emailOrErrors.getValue() as UserEmail;
    const password = passwordOrErrors.getValue() as UserPassword;

    return right(new User({ name, email, password }, id));
  }

  get name(): UserName {
    return this.props.name;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get password(): UserPassword {
    return this.props.password;
  }
}
