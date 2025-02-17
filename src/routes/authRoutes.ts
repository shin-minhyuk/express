import { Router } from "express";
import { googleAuthCallback } from "../controllers/authController";

const router = Router();

router.get("/google", googleAuthCallback);

export default router;
