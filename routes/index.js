const express = require("express");
const authRoutes = require("./auth");
const bookRoutes = require("./book");

const router = express.Router();

const authenticateToken = require("../validation/authenticateToken");

router.use("/auth", authRoutes);
router.use("/book", bookRoutes);
router.get("/profile", authenticateToken, (req, res) => {
  // If it gets here, it must have been a successful request, so return the user
  return res.status(200).json({
    user: {
      email: req.user.email,
      name: req.user.name,
      username: req.user.username,
    },
    msg: "Returning user",
    success: true,
  });
});

module.exports = router;
