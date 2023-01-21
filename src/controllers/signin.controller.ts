import { IController } from "@/interfaces";
import { PrismaUserRepository } from "@/repositories/prisma";
import { AuthenticateUserService } from "@/services";
import { Request, Response } from "express";

export class SigninController implements IController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userRepository = new PrismaUserRepository();
    const authenticateUserService = new AuthenticateUserService(userRepository);
    return res.send("batata");
  }
}
