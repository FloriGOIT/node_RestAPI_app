const jwt = require("jsonwebtoken");
const UserDB = require("../models/usersDb");

const verifyToken = async (req, res, next) => {
  const tokenBearer = req.headers.authorization;
  const parts = tokenBearer.split(" ");
  const tokenValidated = parts[1].replace(/\s+/g, "");
  console.log("string", tokenBearer);
  console.log("token", tokenValidated);
  if (!tokenValidated) {
    return res.status(401).json({
      message: "No token provided or invalid format",
    });
  } else {
    try {
      const decodeToken = jwt.verify(tokenValidated, process.env.JWT_SECRET);
      const user = await UserDB.findById(decodeToken.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      } else {
        req.user = user;
        req.tokenValidated = tokenValidated;
        next();
      }
    } catch (error) {
      console.error("Token verification error:", error.message);
      res.status(401).json({ message: "Not authorized" });
    }
  }
};

module.exports = verifyToken;
