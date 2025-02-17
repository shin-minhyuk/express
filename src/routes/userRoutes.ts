import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *
 * /users/:id:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 */
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
