// controllers/product.controller.js
import { createProduct, getProduct } from "../models/product.model.js";
import { getDatabase, ref, get, remove } from "firebase/database";

const db = getDatabase();

export const addProduct = async (req, res) => {
  const { name, quantity, price } = req.body;
  const farmerId = req.user.id; // From JWT middleware

  const result = await createProduct({ name, quantity, price, farmerId });
  if (result.success) {
    res.status(201).json({ id: result.id });
  } else {
    res.status(500).json({ message: "Failed to add product" });
  }
};

export const getProducts = async (req, res) => {
  const productsRef = ref(db, "products");
  const snapshot = await get(productsRef);
  if (snapshot.exists()) {
    const products = Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
    res.json(products);
  } else {
    res.json([]);
  }
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const productRef = ref(db, `products/${productId}`);
  await remove(productRef);
  res.json({ message: "Product deleted" });
};

export const saveProduct = async (req, res) => {
  // Assuming this updates a product (not in model yet)
  res.json({ message: "Save product not implemented" });
};