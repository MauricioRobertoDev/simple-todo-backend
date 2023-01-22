import { AuthService } from "@/services/auth.service";
import { HttpStatus } from "@/util/http-status";
import { Message } from "@/util/messages";
import { NextFunction, Request, Response } from "express";

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.replace("Bearer", "").trim() as string;
    const data = AuthService.decodeAccessToken(token);
    req.userId = data.id;
    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED);
    res.json({ message: Message.INVALID_ACCESS_TOKEN });
    return res;
  }
}
