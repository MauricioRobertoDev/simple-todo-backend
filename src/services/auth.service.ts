import { AccessTokenDecoded } from "@/dto/access-token.dto";
import jwt from "jsonwebtoken";

export class AuthService {
  static generateJwtToken(playload: object): string {
    const secret = process.env.APP_SECRET as string;
    const token = jwt.sign(playload, secret, { expiresIn: "1d" });
    return token;
  }

  static decodeAccessToken(token: string): AccessTokenDecoded {
    const secret = process.env.APP_SECRET as string;
    const data = jwt.verify(token, secret) as AccessTokenDecoded;
    return data;
  }
}
