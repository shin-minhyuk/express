import { Router } from "express";
import { createNewPost } from "../controllers/postController";

const router = Router();

router.post("/post", createNewPost);

export default router;
