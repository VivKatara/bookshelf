const jwt = require("jsonwebtoken");

module.exports = function authenticateToken(req, res, next) {
  const accessCookie = req.cookies["accessToken"];
  const accessToken = accessCookie && accessCookie.split(" ")[1];
  if (accessToken == null) {
    console.log("Attempt to access without access token");
    return res.status(401).json({ msg: "Forbidden. Please try logging in." });
  }
  // Verify the token
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        console.log("Failed to correctly sign access token");
        return res.status(403).json({ msg: "Invalid token" });
      }
      req.user = user;
      next();
    }
  );
};
