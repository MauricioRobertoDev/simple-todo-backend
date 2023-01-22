import { Either, left, right } from "@/errors/either";
import { TodoDescription, TodoStatus } from "@/objects";
import { ErrorBundle } from "@/shared/error-bundle";
import { Entity } from "./abstract.entity";

type TodoProps = {
  description: TodoDescription;
  status: TodoStatus;
  createdAt: Date;
  ownerId: string;
  startAt?: Date;
  endAt?: Date;
};

type ITodo = {
  description: string;
  createdAt: Date;
  ownerId: string;
  startAt?: Date;
  endAt?: Date;
};

export class Todo extends Entity<TodoProps> {
  private constructor(protected props: TodoProps, id?: string) {
    super(props, id);
  }

  public static create(data: ITodo, id?: string): Either<ErrorBundle, Todo> {
    const bundle = ErrorBundle.create();

    const descriptionOrErrors = TodoDescription.create(data.description);
    const statusOrErrors = TodoStatus.create(data.startAt, data.endAt);

    if (descriptionOrErrors.isLeft())
      bundle.combine(descriptionOrErrors.getValue());
    if (statusOrErrors.isLeft()) bundle.combine(statusOrErrors.getValue());

    if (bundle.hasErrors()) return left(bundle);

    const description = descriptionOrErrors.getValue() as TodoDescription;
    const status = statusOrErrors.getValue() as TodoStatus;

    return right(
      new Todo(
        {
          description,
          status,
          createdAt: data.createdAt,
          ownerId: data.ownerId,
          startAt: data.startAt,
          endAt: data.endAt,
        },
        id
      )
    );
  }

  get description(): TodoDescription {
    return this.props.description;
  }

  get status(): TodoStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get startAt(): Date | undefined {
    return this.props.startAt;
  }

  get endAt(): Date | undefined {
    return this.props.endAt;
  }
}
