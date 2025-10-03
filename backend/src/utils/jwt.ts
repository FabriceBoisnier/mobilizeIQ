import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type JwtPayload = {
  sub: string;
  orgId: string;
  roles: string[];
};

// On restreint bien expiresIn au type exact attendu
export function signAccessToken(
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "1d"
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
