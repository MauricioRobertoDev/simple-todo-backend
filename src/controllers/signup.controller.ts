import { IController } from "@/interfaces";
import { UserData, UserMapper } from "@/mappers/user.mapper";
import { PrismaUserRepository } from "@/repositories/prisma";
import { CreateUserService } from "@/services";
import { HttpStatus } from "@/util/http-status";
import { Message } from "@/util/messages";
import { Request, Response } from "express";

export class SignupController implements IController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userRepository = new PrismaUserRepository();
    const createUserService = new CreateUserService(userRepository);

    const userDataOrErrors = await createUserService.execute({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    if (userDataOrErrors.isLeft()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: Message.VALIDATION_ERRORS,
        errors: userDataOrErrors.getValue().getErrorData(),
      });
    }

    const userData: Omit<UserData, "password"> = UserMapper.toDTO(
      userDataOrErrors.getValue()
    );

    console.log(userData);

    return res.status(HttpStatus.CREATED).json({
      message: Message.CREATED_ACCOUNT,
      data: userData,
    });
  }
}
