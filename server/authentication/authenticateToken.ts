import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const accessCookie = req.cookies["accessToken"];
  const accessToken = accessCookie && accessCookie.split(" ")[1];
  if (accessToken == null) {
    console.log("Attempt to access without access token");
    return res.status(401).json({ msg: "Forbidden. Please try logging in." });
  }
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  // Verify the token
  // TODO You should more strongly type the user parameter here
  jwt.verify(accessToken, accessTokenSecret, async (err: any, user: any) => {
    if (err) {
      console.log("Failed to correctly sign access token");
      return res.status(403).json({ msg: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
