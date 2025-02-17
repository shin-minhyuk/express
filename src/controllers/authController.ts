import { RequestHandler } from "express";
import { handleGoogleCallback, generateToken } from "../services/authService";

export const googleAuthCallback: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Authorization code is required" });
      return;
    }

    const user = await handleGoogleCallback(code);

    // JWT 토큰 생성
    const token = generateToken({
      userId: user.id,
      email: user.loginProvider?.email ?? undefined,
    });

    res.json({ user, token });
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
