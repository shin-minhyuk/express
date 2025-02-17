import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *
 * /user/:id:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 */
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
