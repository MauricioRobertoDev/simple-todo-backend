import { User } from "@/entities";

export type UserData = {
  id: string;
  name: string;
  email: string;
  password: string;
  accessToken?: string;
};

export class UserMapper {
  static toDTO(user: User): UserData {
    return {
      id: user.id,
      name: user.name.getValue(),
      email: user.email.getValue(),
      password: user.password.getValue(),
      accessToken: user.accessToken,
    };
  }
}
