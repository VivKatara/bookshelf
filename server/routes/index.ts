import { Router, Request, Response } from "express";
import authRoutes from "./auth";
import bookRoutes from "./book";
import authenticateToken from "../authentication/authenticateToken";
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

// const express = require("express");
// const authRoutes = require("./auth");
// const bookRoutes = require("./book");

// const router = express.Router();

// const authenticateToken = require("../validation/authenticateToken");

// router.use("/auth", authRoutes);
// router.use("/book", bookRoutes);

// router.get("/profile", authenticateToken, (req, res) => {
//   // If it gets here, it must have been a successful request, so return the user
//   const { email, fullName, username } = req.user;

//   return res.status(200).json({
//     user: {
//       email: email,
//       userFullName: fullName,
//       username: username,
//     },
//   });
// });

export default router;
