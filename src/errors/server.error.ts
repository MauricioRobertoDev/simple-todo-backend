export class ServerError extends Error {
  constructor(public readonly message: string) {
    super(`SERVER -> ${message}`);
  }
}
