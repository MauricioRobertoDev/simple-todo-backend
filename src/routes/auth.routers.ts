import { SigninController, SignupController } from "@/controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.get("/registrar", new SignupController().handle);
authRouter.get("/entrar", new SigninController().handle);

export default authRouter;
