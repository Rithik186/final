// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader); // Debug

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token); // Debug

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token (protect):", decoded); // Debug
    req.user = { id: decoded.id }; // Standardize on 'id'
    next();
  } catch (error) {
    console.error("Token verification failed (protect):", error.message);
    return res.status(401).json({ error: "Not authorized, invalid token" });
  }
};

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Received token (authMiddleware):", token); // Debug

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token (authMiddleware):", decoded); // Debug
    req.user = { id: decoded.id }; // Standardize on 'id' (changed from _id)
    next();
  } catch (error) {
    console.error("Token verification error (authMiddleware):", error.message);
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};