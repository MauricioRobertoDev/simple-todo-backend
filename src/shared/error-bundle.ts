import { AppError } from "@/errors/app.error";

type ErrorData = {
  [key: string]: string[];
};

export class ErrorBundle {
  private constructor(private readonly errors: AppError[] = []) {}

  public static create(errors?: AppError[]): ErrorBundle {
    return new ErrorBundle(errors);
  }

  public combine(...bundles: ErrorBundle[]): ErrorBundle {
    bundles.forEach((bundle) => {
      this.errors.push(...bundle.getErrors());
    });
    return this;
  }

  public add(...errors: AppError[]): ErrorBundle {
    errors.forEach((error) => {
      this.errors.push(error);
    });
    return this;
  }

  public size(): number {
    return this.errors.length;
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  public getErrors(): AppError[] {
    return this.errors;
  }

  public getErrorData(): ErrorData {
    const data: ErrorData = {};
    this.errors.forEach((error) => {
      if (!data[error.type]) data[error.type] = [];
      data[error.type].push(error.message);
    });
    return data;
  }
}
