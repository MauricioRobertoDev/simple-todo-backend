import { User } from "@/entities";
import { prisma } from "@/database/prisma.client";
import { UserRepository } from "../interfaces";

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const userModel = await prisma.userModel.findFirst({ where: { id } });

    if (userModel) {
      const user = User.create(
        {
          name: userModel.name,
          email: userModel.email,
          password: userModel.password,
        },
        userModel.id
      );

      if (user.isLeft()) return null;

      return user.getValue();
    }

    return null;
  }
  async findByEmail(email: string): Promise<User | null> {
    const userModel = await prisma.userModel.findFirst({ where: { email } });

    if (userModel) {
      const user = User.create(
        {
          name: userModel.name,
          email: userModel.email,
          password: userModel.password,
        },
        userModel.id
      );

      if (user.isLeft()) return null;

      return user.getValue();
    }

    return null;
  }
  async exists(email: string): Promise<boolean> {
    const userModel = await prisma.userModel.findFirst({ where: { email } });
    return userModel ? true : false;
  }
  async save(user: User): Promise<void> {
    await prisma.userModel.create({
      data: {
        id: user.id,
        name: user.name.getValue(),
        email: user.email.getValue(),
        password: user.password.getValue(),
      },
    });
  }
}
