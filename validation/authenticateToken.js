const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");

module.exports = function authenticateToken(req, res, next) {
  next();
  // const authToken = req.cookies["accessToken"];
  // const token = authToken && authToken.split(" ")[1];
  // if (token == null) return res.sendStatus(401);

  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //   if (err) return res.sendStatus(403);
  //   req.user = user;
  //   next();
  // });
};
