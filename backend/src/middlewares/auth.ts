import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

// Extension de Express.Request pour inclure user
declare global {
  namespace Express {
    interface User {
      id: string;
      orgId: string;
      roles: string[];
    }
    interface Request {
      user?: User;
    }
  }
}

// --- helpers internes ---
function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  if (req.cookies?.ecofleet_token) return req.cookies.ecofleet_token;
  return null;
}

// --- middlewares ---
export function authOptional(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = {
        id: payload.sub,
        orgId: payload.orgId,
        roles: payload.roles,
      };
    } catch {
      // token invalide → ignore
    }
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const ok = req.user.roles.some((r) => roles.includes(r));
    if (!ok) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
