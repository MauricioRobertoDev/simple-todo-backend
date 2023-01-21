import { IController } from "@/interfaces";
import { UserData, UserMapper } from "@/mappers/user.mapper";
import { PrismaUserRepository } from "@/repositories/prisma";
import { AuthenticateUserService } from "@/services";
import { HttpStatus } from "@/util/http-status";
import { Message } from "@/util/messages";
import { Request, Response } from "express";

export class SigninController implements IController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userRepository = new PrismaUserRepository();
    const authenticateUserService = new AuthenticateUserService(userRepository);

    const userDataOrErrors = await authenticateUserService.execute({
      email: req.body.email,
      password: req.body.password,
    });

    if (userDataOrErrors.isLeft()) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: Message.VALIDATION_ERRORS,
        errors: userDataOrErrors.getValue().getErrorData(),
      });
    }

    const userData: Omit<UserData, "password"> = UserMapper.toDTO(
      userDataOrErrors.getValue()
    );

    return res.status(HttpStatus.OK).json({
      message: Message.LOGIN_SUCCESS,
      data: userData,
    });
  }
}
