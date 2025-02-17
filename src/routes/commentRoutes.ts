import { Router } from "express";
import { createNewComment } from "../controllers/commentController";

const router = Router();

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: 댓글 생성
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: number
 *               parentId:
 *                 type: number
 *                 description: 대댓글인 경우 부모 댓글 ID (선택사항)
 *                 required: false
 *     responses:
 *       200:
 *         description: 댓글 생성 성공
 *       400:
 *         description: 댓글 생성 실패
 */
router.post("/", createNewComment);

export default router;
