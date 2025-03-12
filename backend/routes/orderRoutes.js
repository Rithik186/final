// routes/orderRoute.js
import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.mjs";
import authMiddleware from "../middlewares/authMiddleware.mjs";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);

export default router;