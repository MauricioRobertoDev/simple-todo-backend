import { User } from "@/entities";
import { right } from "@/errors/either";
import { UserName } from "@/objects/user-name.object";
import { UserRepository } from "@/repositories/interfaces";

export class InMemoryUserRepository implements UserRepository {
  private _users: User[] = [];

  async exists(email: string): Promise<boolean> {
    const user = this._users.find((user) => user.email.value == email);
    return user ? true : false;
  }

  async save(user: User): Promise<User> {
    this._users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this._users.find((user) => user.id == id);
    return user ?? null;
  }
}
