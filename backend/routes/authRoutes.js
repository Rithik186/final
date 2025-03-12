// routes/authRoutes.js
import express from "express";
import { signup, signin, syncGoogleUser, checkUserExists } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getUser } from "../models/user.model.js"; // Import Firebase model

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/sync-google-user", syncGoogleUser);
router.post("/check-user", checkUserExists);
router.get("/me", protect, async (req, res) => {
  try {
    const user = await getUser(req.user.id); // Use Firebase model
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const name = user.name || "User";
    res.json({
      id: req.user.id,
      email: user.email,
      name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in /me route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;