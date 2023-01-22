import { Either, right } from "@/errors/either";
import { ErrorBundle } from "@/shared/error-bundle";

enum Status {
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_STARTED = "NOT_STARTED",
}

export class TodoStatus {
  private constructor(public readonly value: Status) {}

  static create(startAt?: Date, endAt?: Date): Either<ErrorBundle, TodoStatus> {
    let status = Status.NOT_STARTED;
    if (endAt) status = Status.DONE;
    if (startAt && !endAt) status = Status.IN_PROGRESS;

    return right(new TodoStatus(status));
  }
}
