const express = require("express");
const authRoutes = require("./auth");

const router = express.Router();

const authenticateToken = require("../validation/authenticateToken");

router.use("/auth", authRoutes);
router.get("/profile", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({
      user: { email: req.user.email, name: req.user.name },
      msg: "Returning user",
      success: true,
    });
});

module.exports = router;
