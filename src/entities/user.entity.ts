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

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: UserProps,
    id?: string
  ): Either<ErrorBundle, User> {
    return right(new User(props, id));
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

  public getData() {
    return {
      id: this.id,
      name: this.name.value,
      email: this.email.value,
      password: this.password.getValue(),
    };
  }

  public static createFromData(props: {
    id: string;
    name: string;
    email: string;
    password: string;
  }): User {
    const name = UserName.create(props.name).getValue() as UserName;
    const email = UserEmail.create(props.email).getValue() as UserEmail;
    const password = UserPassword.create(
      props.password
    ).getValue() as UserPassword;

    return User.create({ name, email, password }, props.id).getValue() as User;
  }
}
