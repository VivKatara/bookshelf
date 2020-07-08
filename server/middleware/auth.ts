import jwt from "jsonwebtoken";
import config from "../config";
import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth";

export const cookieToHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies["accessToken"]) {
    req.headers.authorization = `Bearer ${req.cookies["accessToken"]}`;
  }
  next();
};

export const isAuth = async (req: any, res: any, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken || accessToken === "") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(accessToken, config.accessTokenSecret);
  } catch (err) {
    // There was an accessToken, but it failed, so try refresh token
    const refreshToken = req.cookies["refreshToken"];
    const newAccessToken = await AuthService.RefreshAccessToken(refreshToken);
    if (newAccessToken) {
      req.isAuth = true;
      // req.user = user or something here
    } else {
      req.isAuth = false;
    }
    return next();
  }
  req.isAuth = true;
  //   req.user = user or soemthig here
  next();
};
