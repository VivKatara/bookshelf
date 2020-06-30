import { Router, Request, Response } from "express";
import authRoutes from "./auth";
import bookRoutes from "./book";
import authenticateToken from "../middleware/authenticateToken";

const router = Router();
router.use("/auth", authRoutes);
router.use("/book", bookRoutes);

router.get("/profile", authenticateToken, (req: Request, res: Response) => {
  const { user }: any = req;
  const { email, fullName, username } = user;

  return res.status(200).json({
    user: {
      email: email,
      userFullName: fullName,
      username: username,
    },
  });
});

export default router;
