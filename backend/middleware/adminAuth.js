import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default adminAuth;
