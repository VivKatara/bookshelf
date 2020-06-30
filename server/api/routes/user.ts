import { Router, Request, Response, NextFunction } from "express";
import UserService from "../../services/user";
import authenticateToken from "../middleware/authenticateToken";

const router = Router();

// This specific route should actually never get to the catch block becuase passing authenticateToken middleware effectively means that
// the route will be successfull
router.get(
  "/profile",
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user }: any = req;
      const { email, fullName, username } = user;
      return res.status(200).json({
        user: {
          email: email,
          userFullName: fullName,
          username: username,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/checkUsername",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.query as { username: string };
      const foundUsername = await UserService.checkUsername(username);
      return res.status(200).json({ msg: "Succesfully found username" });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/getUserFullName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.query as { username: string };
      const userFullName = await UserService.getUserFullName(username);
      return res.status(200).json({ userFullName });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
