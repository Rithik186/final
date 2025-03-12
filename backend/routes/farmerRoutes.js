// routes/FarmerRoute.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getEarnings,
  getMarketPrices,
  getProducts,
  getOrders,
  getAnalytics,
  getCropRecommendation,
} from "../controllers/farmer.controller.js";

const router = express.Router();

// Protect all routes with JWT authentication
router.use(protect);

router.get("/earnings", getEarnings);
router.get("/market-prices", getMarketPrices);
router.get("/products", getProducts);
router.get("/orders", getOrders);
router.get("/analytics", getAnalytics);
router.get("/crop-recommendation", getCropRecommendation);

export default router;