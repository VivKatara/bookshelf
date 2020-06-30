import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import bookRoutes from "./book";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/book", bookRoutes);

export default router;
