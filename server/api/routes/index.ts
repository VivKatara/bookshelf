import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import bookRoutes from "./book";
import BookCollection from "../../models/BookCollection";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/book", bookRoutes);

// router.get("/example", async (req, res) => {
//   const cursor = BookCollection;
//   console.log(cursor);
//   return res.send("Success");
// });

export default router;
