import { Request, Response, RequestHandler } from "express";
import { findUsers, findUserById } from "../services/userService";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await findUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
