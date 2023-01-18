import { User } from "@/entities";

export interface UserRepository {
  findById(id: string): Promise<User | null>;

  exists(email: string): Promise<boolean>;

  save(props: {
    id: string;
    name: string;
    email: string;
    password: string;
  }): Promise<User>;

  update(props: {
    id: string;
    name?: string;
    email?: string;
    password?: string;
  }): Promise<User>;
}
