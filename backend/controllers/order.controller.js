// controllers/orderController.mjs
import { createOrder, getOrder } from "../models/order.model.js";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";

const db = getDatabase();

export const createOrder = async (req, res) => {
  const { products, totalAmount } = req.body;
  const consumer = req.user.id; // From middleware

  const result = await createOrder({ consumer, products, totalAmount });
  if (result.success) {
    res.status(201).json({ id: result.id });
  } else {
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getOrders = async (req, res) => {
  const ordersRef = ref(db, "orders");
  const consumerQuery = query(ordersRef, orderByChild("consumer"), equalTo(req.user.id));
  const snapshot = await get(consumerQuery);
  if (snapshot.exists()) {
    const orders = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
    res.json(orders);
  } else {
    res.json([]);
  }
};