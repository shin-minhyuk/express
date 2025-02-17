import { RequestHandler } from "express";
import { handleGoogleCallback } from "../services/authService";

export const googleAuthCallback: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Authorization code is required" });
      return;
    }

    const user = await handleGoogleCallback(code);
    res.json({ user });
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
