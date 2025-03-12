// backend/models/user.model.js
import { ref, set, get, child } from "firebase/database";
import { db } from "../firebaseConfig.js"; // Import initialized db

/*
  Expected User structure in Realtime Database:
  {
    "users": {
      "<userId>": {
        email: String,
        password: String,
        name: String,
        uid: String,
        createdAt: String,
        role: "farmer" | "consumer"
      }
    }
  }
*/

// Function to create or update a user
export async function createUser(userId, userData) {
  const userRef = ref(db, `users/${userId}`);
  try {
    await set(userRef, {
      email: userData.email,
      password: userData.password || null,
      name: userData.name || null,
      uid: userData.uid || null,
      createdAt: userData.createdAt || new Date().toISOString(),
      role: userData.role,
    });
    return { success: true, id: userId };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
}

// Function to get a user by ID
export async function getUser(userId) {
  const userRef = ref(db);
  try {
    const snapshot = await get(child(userRef, `users/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default { createUser, getUser };