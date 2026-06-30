
const jwt = require("jsonwebtoken");

const User = require("../models/user");


module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.id);
    console.log("User:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};