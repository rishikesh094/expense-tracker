const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ msg: "Access Denied!" });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;