// When the project gets bigger, ideally this should be moved to its own authentication server

import { Router, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserCollection from "../../models/UserCollection";
import UserBooksCollection from "../../models/UserBooksCollection";
import TokenCollection from "../../models/TokenCollection";
import createUsername from "../../utils/createUsername";

const router = Router();

// TODO Refactor all of these routes to make it a bit easier to read
router.post("/register", async (req: Request, res: Response) => {
  const { email, fullName, password } = req.body;
  const user = await UserCollection.findOne({ email });
  if (user) {
    return res.status(409).json({ msg: "This email already exists" });
  }
  const username = await createUsername(fullName);
  const newUser = new UserCollection({ email, fullName, username, password });
  const newUserBooks = new UserBooksCollection({
    email,
    username,
    currentBooks: [],
    currentBooksCount: 0,
    currentBooksDisplayCount: 0,
    pastBooks: [],
    pastBooksCount: 0,
    pastBooksDisplayCount: 0,
    futureBooks: [],
    futureBooksCount: 0,
    futureBooksDisplayCount: 0,
  });

  // Hash the password before saving it in the database
  bcrypt.genSalt(10, (err: any, salt: any) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Something unexpected occurred. Please try again." });
    }
    bcrypt.hash(newUser.password, salt, (err: any, hash: any) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ msg: "Something unexpected occurred. Please try again." });
      }
      newUser.password = hash;
      newUser
        .save()
        .then(async (savedUser: any) => {
          await newUserBooks.save();
          console.log(`Successful Register of ${email}`);
          return res.status(200).json({
            user: { email: savedUser.email, name: savedUser.fullName },
            msg: "Successful register",
          });
        })
        .catch((err: any) => {
          console.log(err);
          return res
            .status(500)
            .json({ msg: "Something unexpected occurred. Please try again." });
        });
    });
  });
});

// Login route, you have to add access tokens and refresh tokens to this
router.post("/login", (req: Request, res: Response) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Something unexpected occurred. Please try again." });
    } else if (!user) {
      console.log(info.message);
      return res.status(401).json({ msg: info.message });
    } else {
      req.logIn(user, (err) => {
        const payload = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          username: user.username,
        };
        const accessToken = generateAccessToken(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          "1d"
        );
        const refreshToken = generateAccessToken(
          payload,
          process.env.REFRESH_TOKEN_SECRET,
          "7d"
        );

        // Save the refreshToken in database
        // TODO Make this more safe with encryption of the refreshtoken in case the db were to ever be compromised
        const newRefreshToken = new TokenCollection({
          refreshToken,
        });

        newRefreshToken.save();

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
      });
    }
  })(req, res);
});

router.get("/token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];
  if (refreshToken === null) {
    console.log("Attempt to refresh access token without refresh token");
    return res
      .status(401)
      .json({ msg: "Invalid. Please try logging in again.", success: false });
  }
  const foundToken = await TokenCollection.findOne({ refreshToken });
  if (foundToken) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err: any, user: any) => {
        if (err) {
          console.log("Error when trying to verify refresh token");
          return res.status(403).json({
            msg: "Invalid. Please try logging in again.",
            success: false,
          });
        }
        // Preserve original user data when recreating access token
        const payload = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          username: user.username,
        };
        const accessToken = generateAccessToken(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          "1d"
        );
        // Rewrite the access token
        res.cookie("accessToken", `Bearer ${accessToken}`, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.sendStatus(200);
      }
    );
  } else {
    console.log("Provided refresh token not in database");
    return res
      .status(403)
      .json({ msg: "Invalid. Please try logging in again.", success: false });
  }
});

// Logout - do we get rid of all browser cookies, and all session data? Must this be checked?
router.delete("/logout", async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];
  await TokenCollection.deleteOne({ refreshToken });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  req.logout(); // Is this needed? Check Passport documentation
  return res.status(200).json({ msg: "Successful logout", success: true });
});

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

function generateAccessToken(payload: any, secret: any, expires: any) {
  return jwt.sign(payload, secret, { expiresIn: expires });
}

export default router;
