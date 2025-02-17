import { Router } from "express";
import { googleAuthCallback } from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Authorization code is required
 *       500:
 *         description: Authentication failed
 */
router.get("/google", googleAuthCallback);

export default router;
