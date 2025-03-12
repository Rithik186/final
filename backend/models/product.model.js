// backend/models/product.model.js
import { ref, push, set, get } from "firebase/database";
import { db } from "../firebaseConfig.js"; // Import initialized db

/*
  Expected Product structure in Realtime Database:
  {
    "products": {
      "<productId>": {
        name: String,
        quantity: Number,
        price: Number,
        farmerId: String,
        createdAt: String
      }
    }
  }
*/

// Function to create a new product
export async function createProduct(productData) {
  const productsRef = ref(db, "products");
  const newProductRef = push(productsRef);
  try {
    await set(newProductRef, {
      name: productData.name,
      quantity: productData.quantity,
      price: productData.price,
      farmerId: productData.farmerId || null,
      createdAt: productData.createdAt || new Date().toISOString(),
    });
    return { success: true, id: newProductRef.key };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error };
  }
}

// Function to get a product by ID
export async function getProduct(productId) {
  const productRef = ref(db, `products/${productId}`);
  try {
    const snapshot = await get(productRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default { createProduct, getProduct };