import bcrypt from "bcryptjs";
import { Router } from "express";
import { prisma } from "../config/prisma.js"; // ou ../utils/prisma si tu gardes
import { requireAuth } from "../middlewares/auth.js";
import { signAccessToken } from "../utils/jwt.js";

const router = Router();

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // 🟢 Champ correct = passwordHash
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  // 🟢 Adapter le token aux types réels
  const token = signAccessToken({
    sub: String(user.id), // User.id = Int → converti en string
    orgId: String(user.orgId), // orgId = Int → converti en string
    roles: [user.role], // role = String → mis dans un tableau
  });

  res.cookie("ecofleet_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 jour
  });

  return res.json({
    message: "Logged in",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    },
  });
});

/**
 * POST /auth/logout
 */
router.post("/logout", (_req, res) => {
  res.clearCookie("ecofleet_token");
  return res.json({ message: "Logged out" });
});

/**
 * GET /auth/me
 */
router.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

export default router;
