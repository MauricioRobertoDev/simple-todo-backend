import { Either } from "@/errors/either";
import { ErrorBundle } from "@/shared/error-bundle";

export interface IService<Input, Output> {
  execute(req: Input): Promise<Either<ErrorBundle, Output>>;
}
