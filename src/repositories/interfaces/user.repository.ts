import { User } from "@/entities";

export interface UserRepository {
  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  exists(email: string): Promise<boolean>;

  save(user: User): Promise<User>;
}
