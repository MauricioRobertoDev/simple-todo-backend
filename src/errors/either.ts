export type Either<L, R> = Left<L> | Right<R>;

export class Left<L> {
  constructor(public readonly value: L) {}

  getValue(): L {
    return this.value;
  }

  isLeft(): this is Left<L> {
    return true;
  }

  isRight(): this is Right<never> {
    return false;
  }
}
export class Right<R> {
  constructor(public readonly value: R) {}

  getValue(): R {
    return this.value;
  }

  isLeft(): this is Left<never> {
    return false;
  }

  isRight(): this is Right<R> {
    return true;
  }
}

export const left = <L>(l: L): Left<L> => {
  return new Left(l);
};

export const right = <R>(r: R): Right<R> => {
  return new Right(r);
};
