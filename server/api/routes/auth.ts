// When the project gets bigger, ideally this should be moved to its own authentication server
import { Router, Request, Response, NextFunction } from "express";
import UserCollection from "../../models/UserCollection";
import { SignUp, SignOut, SignIn, RefreshAccessToken } from "../services/auth";

const router = Router();

// Register route
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, fullName, password } = req.body;
      const { user } = await SignUp(email, fullName, password);
      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }
);

// Login route
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const [accessToken, refreshToken]: [string, string] = await SignIn(
        email,
        password
      );
      // Lifetime is a year, is this too long?
      res.cookie("accessToken", `Bearer ${accessToken}`, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json({ msg: "Logged In Successfully" });
    } catch (err) {
      next(err);
    }
  }
);

// Refresh Token route
router.get(
  "/token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies["refreshToken"];
      const newAccessToken = await RefreshAccessToken(refreshToken);

      // Rewrite the access token
      res.cookie("accessToken", `Bearer ${newAccessToken}`, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res
        .status(200)
        .json({ msg: "Successfully refreshed access token" });
    } catch (err) {
      next(err);
    }
  }
);

// Logout - do we get rid of all browser cookies, and all session data? Must this be checked?
router.delete(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies["refreshToken"];
      await SignOut(refreshToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ msg: "Success" });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/checkUsername", async (req: Request, res: Response) => {
  const { username } = req.query as { username: string };
  const user = await UserCollection.findOne({ username });
  if (user) return res.status(200).json({ msg: "Success" });
  else return res.status(400).json({ msg: "Can't find username" });
});

router.get("/getUserFullName", async (req: Request, res: Response) => {
  const { username } = req.query as { username: string };
  const user = await UserCollection.findOne({ username });
  if (user) return res.status(200).json({ userFullName: user.fullName });
  else return res.status(400).json({ msg: "Can't find user's full name" });
});

export default router;
