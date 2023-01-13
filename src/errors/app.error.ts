export class AppError extends Error {
  constructor(public readonly type: string, public readonly message: string) {
    super(message);
  }
}
