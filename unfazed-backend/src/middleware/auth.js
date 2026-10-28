const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  let payload;
  try {
    payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  const user = await User.findById(payload.id).select("_id role");
  if (!user) {
    return res.status(401).json({ success: false, message: "Account no longer exists" });
  }
  req.user = { id: user._id.toString(), role: user.role };
  return next();
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "You are not allowed to perform this action" });
  }
  return next();
};

module.exports = { authenticate, requireRole };
