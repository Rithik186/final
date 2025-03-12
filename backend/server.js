import express, { json } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoute from "./routes/productRoute.js";
import authRoutes from "./routes/authRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";


const app = express();

const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/products", productRoute);
app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
