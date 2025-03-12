// controllers/auth.controller.js
import { createUser, getUser } from "../models/user.model.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const db = getDatabase();

export const signup = async (req, res) => {
  const { email, password, name, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = `user_${Date.now()}`; // Replace with Firebase Auth UID
  const result = await createUser(userId, { email, password: hashedPassword, name, role });
  if (result.success) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } else {
    res.status(500).json({ message: "Signup failed" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const usersRef = ref(db, "users");
  const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
  const snapshot = await get(emailQuery);
  if (!snapshot.exists()) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const userData = Object.values(snapshot.val())[0];
  const userId = Object.keys(snapshot.val())[0];
  if (await bcrypt.compare(password, userData.password)) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
};

export const syncGoogleUser = (req, res) => res.json({ message: "Google sync TBD" });
export const checkUserExists = (req, res) => res.json({ message: "Check user TBD" });