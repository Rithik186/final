// controllers/user.controller.js
import { createUser, getUser } from "../models/user.model.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";
import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For token generation

const db = getDatabase();

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if email already exists
  const usersRef = ref(db, "users");
  const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
  const snapshot = await get(emailQuery);
  if (snapshot.exists()) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Use a custom ID or Firebase Auth UID (assuming you integrate Firebase Auth)
  const userId = `user_${Date.now()}`; // Placeholder; ideally use Firebase Auth UID
  const result = await createUser(userId, {
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (result.success) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } else {
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Query user by email
  const usersRef = ref(db, "users");
  const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
  const snapshot = await get(emailQuery);
  if (!snapshot.exists()) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const userData = Object.values(snapshot.val())[0];
  const userId = Object.keys(snapshot.val())[0];
  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};

export const logout = (req, res) => {
  // Client-side token invalidation (no DB change needed)
  res.json({ message: "Logged out successfully" });
};