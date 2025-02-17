import { RequestHandler } from "express";
import { createPost } from "../services/postService";
import { verifyToken } from "../services/authService";

export const createNewPost: RequestHandler = async (req, res) => {
  try {
    // Bearer 토큰 확인
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authorization.split(" ")[1];
    const { userId } = await verifyToken(token);

    const { title, content } = req.body;
    const post = await createPost({
      title,
      content,
      authorId: userId,
    });

    res.json(post);
  } catch (error: any) {
    if (error.message === "Invalid token") {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
