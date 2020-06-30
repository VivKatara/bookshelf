// When the project gets bigger, ideally this should be moved to its own authentication server
import { Router, Request, Response, NextFunction } from "express";
import AuthService from "../../services/auth";

const router = Router();

// Register route
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, fullName, password } = req.body;
      const { user } = await AuthService.SignUp(email, fullName, password);
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
      const [accessToken, refreshToken]: [
        string,
        string
      ] = await AuthService.SignIn(email, password);
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
      const newAccessToken = await AuthService.RefreshAccessToken(refreshToken);

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

// Logout route
router.delete(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies["refreshToken"];
      await AuthService.SignOut(refreshToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ msg: "Success" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
