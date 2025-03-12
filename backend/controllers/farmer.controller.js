// controllers/farmer.controller.js
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";

const db = getDatabase();

export const getProducts = async (req, res) => {
  const productsRef = ref(db, "products");
  const farmerQuery = query(productsRef, orderByChild("farmerId"), equalTo(req.user.id));
  const snapshot = await get(farmerQuery);
  if (snapshot.exists()) {
    const products = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
    res.json(products);
  } else {
    res.json([]);
  }
};

export const getOrders = async (req, res) => {
  // Orders tied to farmer’s products (assumed logic)
  res.json({ message: "Not fully implemented" });
};

// Placeholder for others
export const getEarnings = (req, res) => res.json({ message: "Earnings TBD" });
export const getMarketPrices = (req, res) => res.json({ message: "Market prices TBD" });
export const getAnalytics = (req, res) => res.json({ message: "Analytics TBD" });
export const getCropRecommendation = (req, res) => res.json({ message: "Crop recommendation TBD" });