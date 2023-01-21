import { User } from "@/entities";
import { UserRepository } from "@/repositories/interfaces";

export class InMemoryUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = this._users.find((user) => user.email.value == email);
    return user ? user : null;
  }

  private _users: User[] = [];

  async exists(email: string): Promise<boolean> {
    const user = this._users.find((user) => user.email.value == email);
    return user ? true : false;
  }

  async save(user: User): Promise<void> {
    this._users.push(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = this._users.find((user) => user.id == id);
    return user ?? null;
  }
}
