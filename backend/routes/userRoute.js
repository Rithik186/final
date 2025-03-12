// routes/userRoute.js
import express from "express";
import { register, login, logout } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { protect } from "../middlewares/authMiddleware.js";
import Joi from "joi";

const router = express.Router();

// Define registerSchema
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("farmer", "consumer").required(),
});

// Define loginSchema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Routes
router.post("/register", (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}, register);

router.post("/login", (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
}, login);

router.post("/logout", logout);

// Protected routes
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

router.get("/debug-token", protect, (req, res) => {
  res.json({ userId: req.user.id });
});

export default router;