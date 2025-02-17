import { RequestHandler } from "express";
import { verifyToken } from "../services/authService";
import createComment from "../services/commentService";

export const createNewComment: RequestHandler = async (req, res) => {
  try {
    const { content, postId, parentId } = req.body;

    // Bearer 토큰 확인
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authorization.split(" ")[1];
    const { userId } = await verifyToken(token);

    // 필수 필드 검증
    if (!content || !postId) {
      res.status(400).json({ error: "Content and postId are required" });
      return;
    }

    const comment = await createComment({
      content,
      postId,
      authorId: userId,
      parentId: parentId ? Number(parentId) : undefined,
    });

    res.json(comment);
  } catch (error: any) {
    if (error.message === "Invalid token") {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    if (error.message === "Post not found") {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    if (error.message === "Parent comment not found") {
      res.status(404).json({ error: "Parent comment not found" });
      return;
    }
    if (error.message === "Parent comment belongs to different post") {
      res.status(400).json({ error: "Invalid parent comment" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
