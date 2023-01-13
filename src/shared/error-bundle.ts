import { AppError } from "@/errors/app.error";

export class ErrorBundle {
  private constructor(private readonly errors: AppError[] = []) {}

  public static create(errors?: AppError[]): ErrorBundle {
    return new ErrorBundle(errors);
  }

  public combine(...bundles: ErrorBundle[]): void {
    bundles.forEach((bundle) => {
      this.errors.push(...bundle.getErrors());
    });
  }

  public add(...errors: AppError[]): void {
    errors.forEach((error) => {
      this.errors.push(error);
    });
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
}
