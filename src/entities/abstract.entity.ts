import crypto from "crypto";

export abstract class Entity<T> {
  private _id: string;

  constructor(protected props: T, id?: string) {
    this._id = id ?? crypto.randomUUID();
  }

  public get id(): string {
    return this._id;
  }
}
