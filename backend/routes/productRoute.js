// routes/productRoute.js
import express from "express";
import { addProduct, getProducts, deleteProduct, saveProduct } from "../controllers/product.controller.js";
import { protect, authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/products", protect, addProduct); // Adjusted to match controller name
router.get("/products", protect, getProducts); // Added GET for consistency
router.delete("/remproduct/:id", protect, deleteProduct);
router.post("/save-products", authMiddleware, saveProduct);

export default router;