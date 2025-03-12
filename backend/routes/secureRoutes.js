// routes/secureRoute.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/protected-route", verifyToken, (req, res) => {
  res.json({ message: "You have access!", user: req.user });
});

export default router;