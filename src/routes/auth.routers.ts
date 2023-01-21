import { SigninController, SignupController } from "@/controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/registrar", new SignupController().handle);
authRouter.post("/entrar", new SigninController().handle);
authRouter.get("/buh", (req, res) => res.send("batata"));

export default authRouter;
