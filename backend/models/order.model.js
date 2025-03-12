// backend/models/order.model.js
import { ref, push, set, get } from "firebase/database";
import { db } from "../firebaseConfig.js"; // Import initialized db

/*
  Expected Order structure in Realtime Database:
  {
    "orders": {
      "<orderId>": {
        consumer: String,
        products: {
          "<productId>": {
            quantity: Number
          }
        },
        totalAmount: Number,
        status: "Pending" | "Completed" | "Cancelled",
        createdAt: String,
        updatedAt: String
      }
    }
  }
*/

// Function to create a new order
export async function createOrder(orderData) {
  const ordersRef = ref(db, "orders");
  const newOrderRef = push(ordersRef);
  try {
    const productsObj = orderData.products.reduce((acc, item) => {
      acc[item.product] = { quantity: item.quantity };
      return acc;
    }, {});

    await set(newOrderRef, {
      consumer: orderData.consumer,
      products: productsObj,
      totalAmount: orderData.totalAmount,
      status: orderData.status || "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: newOrderRef.key };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error };
  }
}

// Function to get an order by ID
export async function getOrder(orderId) {
  const orderRef = ref(db, `orders/${orderId}`);
  try {
    const snapshot = await get(orderRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default { createOrder, getOrder };