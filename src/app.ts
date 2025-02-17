import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

export default app;
